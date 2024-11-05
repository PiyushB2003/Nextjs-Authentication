import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import {MailtrapTransport} from "mailtrap";

const TOKEN = "11a3704132a5fd107237d0bc662c21b6";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)
    if(emailType === "VERIFY"){
      await User.findByIdAndUpdate(userId, 
        {verifyToken: hashedToken, VerifyTokenExpiry: Date.now() + 3600000}
      )
    }else if(emailType === "RESET"){
      await User.findByIdAndUpdate(userId, 
        {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
      )
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: "e3df176f81af08",
        pass: "a48c4ba6c2c633",
      },
    });
    const mailOptions = {
      from: 'piyush95@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`
  }

      const mailResponse = await transporter.sendMail(mailOptions);
      return mailResponse;
  } catch (error:any) {
    throw new Error(error.message);
  }
};
