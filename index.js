import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routes from './router/authRouter.js';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env.PORT || '3000';
const connString = process.env.MONGO_URI;


const corsOptions = {
  origin: 'https://auth-system-git-main-abdullah-mustaphas-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(connString)
  .then(() => console.log('\nMongoDB Connected...'))
  .catch((error) => console.log('MongoDB connection error: ', error));
mongoose.set("strictQuery", false)

app.use('/api', routes);

app.get('/api', (req, res) => {
  res.send("You not suppose to do that! you're not authorized here you asshole")
})

app.listen(port, () => console.log(`\n\napp is running on http://localhost:${port}/api`));


export default (req, res) => {
  return app(req, res);
};