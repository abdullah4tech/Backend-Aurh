import User from '../models/User.js';

const findAccountController = async (req, res) => {
  const { email } = req.body;

  try {
    const dbUser = await User.findOne({ email }).exec();
    
    if (!dbUser) {
      return res.status(400).json({ message: 'Account not found!' });
    }

    // Return only necessary user details (e.g., id and email)
    const userResponse = {
      id: dbUser._id,
      email: dbUser.email,
    };

    return res.status(200).json({ message: 'Account found', user: userResponse });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default findAccountController;
