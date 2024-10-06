


// Generate OTP (6-digit number as a string)
export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const timestamp = Date.now();
  return { otp, timestamp };
};

export const formatDate = () => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

