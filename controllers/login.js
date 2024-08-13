import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config()

const jwtToken = process.env.JWT_LOGIN_TOKEN;

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbUser = await User.findOne({ email }).exec();
    if (!dbUser) {
      return res.status(400).json({ message: 'Account not found!' });
    }

    const match = await bcrypt.compare(password, dbUser.password) ? true : false

    if (match) {
      const token = jwt.sign(
        { _id: dbUser.id, name: dbUser.fullname, email: dbUser.email }, jwtToken
      );

      dbUser.token = token;
      await dbUser.save();

      res.cookie('token', token);

      return res.json({
        status: 'success',
        message: 'Login success',
        token,
      });
    } else {
      return res.status(400).json({ message: 'email or password incorrect!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default LoginController;
