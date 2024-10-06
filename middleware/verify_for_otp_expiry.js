const OTP_EXPIRATION_TIME = 5 * 60 * 1000; 

export const verifyOtpMiddleware = (req, res, next) => {
  const { otp, timestamp } = req.body; 
  
  if (!otp || !timestamp) {
    return res.status(400).json({ message: 'OTP or timestamp is missing' });
  }

  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  // Check if OTP has expired
  if (timeDifference > OTP_EXPIRATION_TIME) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  // Proceed to the next middleware or route handler if OTP is still valid
  next();
};
