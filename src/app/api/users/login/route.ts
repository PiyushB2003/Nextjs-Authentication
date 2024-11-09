import { MongoConnect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bacryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
dotenv.config();
MongoConnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User doesn't exist" },
                { status: 400 }
            );
        }

        console.log("User exist");
        const validPassword = await bacryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Check your credentials" },
                { status: 400 }
            );
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = await jwt.sign(tokenData, "mynameispiyush", {
            expiresIn: "1d",
        });

        const response = NextResponse.json(
            { messgae: "Logged in successfully", sucess: true },
            { status: 200 }
        );
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
