const bcrypt = require("bcryptjs");
const saltRounds = 10;
const myPlaintextPassword = "Test@123#";
const { hash } = require("bcryptjs");

const main = async () => {
  const hashedPassword = await hash(myPlaintextPassword, 12);
  console.log(hashedPassword);
};
main();
