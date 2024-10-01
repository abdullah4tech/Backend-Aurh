import { Router } from "express";
import signupController from "../controllers/signup.js";
import LoginController from "../controllers/login.js";
import authController from "../controllers/auth.js";
import LogoutController from "../controllers/logout.js";
import findAccountController from '../controllers/findaccount.js'
import generateOtpController from "../controllers/generateOtp.js";

const routes = Router()

routes.post('/login', LoginController)
routes.post('/signup', signupController)
routes.post('/auth', authController)
routes.post('/logout', LogoutController)
routes.post('/findaccount', findAccountController)
routes.post('/sendopt', generateOtpController)

export default routes
