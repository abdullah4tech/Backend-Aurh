import mongoose from 'mongoose';


// Create a schema corresponding to the document interface
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
  }
});

// Create a model using the schema and interface
const User = mongoose.model('User', userSchema);

export default User;
