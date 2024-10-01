import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  code: {
    type: String, // Store as string to support leading zeros
    required: true
  },
  expiresAt: {
    type: Date, // Date object to store the expiration time
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
