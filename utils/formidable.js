import { IncomingForm } from "formidable";
var mv = require("mv");

export async function getImage(formData) {
  let book;
  const data = await new Promise(function (resolve, reject) {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(formData, function (err, fields, files) {
      if (err) return reject(err);
      let oldPath = files.file.filepath;
      let newPath = `./public/books/${files.file.originalFilename}`;
      book = files.file.originalFilename;
      mv(oldPath, newPath, function (err) {});
      resolve({ fields, files });
    });
  });

  return book;
}
