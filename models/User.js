import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  code: {
    type: String, 
    required: true
  },
  expiresAt: {
    type: Date, 
    required: true
  }
});

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: null
  },
  otp: {
    type: otpSchema,
    default: null
  }
});

const User = mongoose.model('User', userSchema);

export default User;
