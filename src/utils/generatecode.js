import crypto from "crypto";

const generateUniqueCode = () => {
  return crypto.randomBytes(3).toString("hex");
};

export default generateUniqueCode;
