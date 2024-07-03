import crypto from 'crypto';

const generateUniqueCode = () => {
  return crypto.randomBytes(8).toString('hex');
};

export default generateUniqueCode;