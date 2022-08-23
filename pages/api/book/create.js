import multer from "multer";
import nc from "next-connect";
import path from "path";
import prisma from "../../../utils/prisma";
import { fromPath } from "pdf2pic";

import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

const myDate = new Date();
const today =
  myDate.getFullYear() +
  "-" +
  (myDate.getMonth() + 1) +
  "-" +
  myDate.getDate() +
  "-" +
  myDate.getTime();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), "public", "books"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + "-" + today + ".pdf");
    },
  }),
});

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  // .use(async (req, res, next) => {
  //   const session = await getSession({ req });
  //   if (!session) {
  //     res.status(401).json({ message: "unauthenticated" });
  //     // next();
  //   } else {
  //     next();
  //   }
  // })
  .use(upload.single("file"))
  .post(async (req, res) => {
    const {
      bookTitle,
      bookDescription,
      bookYear,
      bookAuthor,
      bookPublisher,
      bookIsbn,
      bookRecommendedBy,
      bookCategory,
    } = req.body;

    const bookUrl = req.file.filename.trim();
    const bookThumb = `${bookUrl}.1.png`;
    const oldPath = req.file.path;
    const options = {
      density: 100,
      saveFilename: bookUrl,
      savePath: "./public/book-images",
      format: "png",
      width: 600,
      height: 600,
    };

    if (
      bookTitle.trim() === "" ||
      bookDescription.trim() === "" ||
      bookYear === null ||
      bookAuthor.trim() === "" ||
      bookPublisher.trim() === "" ||
      bookIsbn.trim() === "" ||
      bookRecommendedBy.trim() === "" ||
      bookCategory.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid Input" });
    }

    const storeAsImage = fromPath(oldPath, options);
    const pageToConvertAsImage = 1;

    storeAsImage(pageToConvertAsImage).then((resolve) => {
      console.log(`Page 1 is now converted as image ${bookUrl}`);

      return resolve;
    });

    try {
      const check = await prisma.Book.findFirst({
        where: {
          bookIsbn: bookIsbn,
        },
      });
      if (check) {
        res.status(403).json({
          message:
            "Book ISBN Should Be Unique! Please use other ISBN and try again",
        });
      } else {
        const result = await prisma.Book.create({
          data: {
            bookTitle: bookTitle.trim(),
            bookDescription: bookDescription.trim(),
            bookYear: parseInt(bookYear),
            bookAuthor: bookAuthor.trim(),
            bookPublisher: bookPublisher.trim(),
            bookIsbn: bookIsbn.trim(),
            bookRecommendedBy: bookRecommendedBy.trim(),
            bookCategory: bookCategory.trim(),
            bookUrl: bookUrl.trim(),
            bookThumb: bookThumb.trim(),
          },
        });
        res.status(200).json(result);
      }
    } catch (err) {
      console.log(err);
      res
        .status(403)
        .json({ message: "Error occured while adding a new Book" });
    }
  });

export default handler;
