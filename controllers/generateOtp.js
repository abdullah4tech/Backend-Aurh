import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

// Generate OTP (6-digit number as a string)
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


const formatDate = () => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

// Configure nodemailer (assuming Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const generateOtpController = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const dbUser = await User.findOne({ email }).exec();
    
    if (!dbUser) {
      return res.status(400).json({ message: 'Account not found!' });
    }

    // Generate OTP and hash it
    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 15 minutes

    // Hash the OTP using bcrypt
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otpCode, saltRounds);

    // Update user's OTP and save to the database
    dbUser.otp = {
      code: hashedOtp, // Store hashed OTP
      expiresAt: otpExpiresAt
    };
    await dbUser.save();

    // Send the OTP to the user's email (send the raw OTP, not the hashed version)
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      html: `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>OTP Email</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://your-company-logo-url.com" 
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px; color: #ffffff;"
                  >${formatDate()}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Your OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hey ${dbUser.fullname},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for using Drop Dev. Auth system. Use the following OTP
              to complete your request. OTP is valid for
              <span style="font-weight: 600; color: #1f1f1f;">15 minutes</span>.
              Do not share this code with anyone, including DevTech employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
              ${otpCode}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:abdullahmu4life@gmail.com"
            style="color: #499fb6; text-decoration: none;"
            >abdullahmu4life@gmail.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          Drop Dev.
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 123, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="https://x.com/_abdullah4tech" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="X (Twitter)"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2024 DevTech. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>

      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error generating OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default generateOtpController;
