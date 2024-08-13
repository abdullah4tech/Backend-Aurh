import jwt from 'jsonwebtoken'
import User from '../models/User.js';



const jwtToken = process.env.JWT_LOGIN_TOKEN;


const authController = async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {

      const dbUser = await User.findOne({ token }).exec();
      if (!dbUser) {
        return res.status(401).json({ auth: false, data: 'Invalid token' });
      }

      const decoded = jwt.verify(token, jwtToken);

      res.json({
        auth: true,
        data: decoded,
      });
    } catch (error) {
      res.status(401).json({
        auth: false,
        data: 'Invalid token',
      });
    }
  } else {
    res.status(400).json({
      auth: false,
      data: 'Token not found',
    });
  }
};

export default authController;
