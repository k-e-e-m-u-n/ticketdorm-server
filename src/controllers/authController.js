import cryptoHash from 'crypto';
import User from '../models/usermodel.js'
import { signUpValidator,signInValidator } from '../validation/authValidation.js';
import {formatZodError} from '../utils/errorMessage.js'
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

function hashValue(value) {
    const hash = cryptoHash.createHash('sha256');
    hash.update(value);
    return hash.digest('hex');
}

function comparePasswords(inputPassword, hashedPassword) {
    return hashValue(inputPassword) === hashedPassword;
}


