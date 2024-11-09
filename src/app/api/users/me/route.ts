import { MongoConnect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { getDataFromToken } from "@/helpers/getDataFromToken";
dotenv.config();
MongoConnect();

export async function POST(request: NextRequest) {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password -username");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", data: user }, { status: 200 });
}