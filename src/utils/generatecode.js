import crypto from "crypto";

const generateUniqueCode = () => {
  return crypto.randomBytes(5).toString("hex");
};

export default generateUniqueCode;
