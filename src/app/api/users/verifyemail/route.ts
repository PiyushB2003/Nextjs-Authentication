import { MongoConnect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bacryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import dotenv from "dotenv";
dotenv.config();
MongoConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      VerifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }
    console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.VerifyTokenExpiry = undefined;

    await user.save();
    return NextResponse.json({ message: "Email verified successfully", success: true }, { status: 200 });

    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
