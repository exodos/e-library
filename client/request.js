import axios from "axios";
import { baseUrl } from "./config";
import { getValue } from "../utils/common";

export const createBook = async (form) => {
  try {
    const res = await axios.post(baseUrl + `/book/create`, form);
    return res.data;
  } catch (error) {
    return getValue(error, ["response", "data"]);
  }
};

// export const publishBook = async (form) => {
//   try {
//     const res = await axios.post(baseUrl + `/book/publish`, form);
//     return res.data;
//   } catch (error) {
//     return getValue(error, ["response", "data"]);
//   }
// };
