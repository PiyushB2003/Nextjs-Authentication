import { MongoConnect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextRequest, NextResponse} from "next/server";
import bacryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import dotenv from "dotenv";
dotenv.config();
MongoConnect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        const salt = await bacryptjs.genSalt(10);
        const hashedPassword = await bacryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save();
        console.log(savedUser);
        
        // Send verfication email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}