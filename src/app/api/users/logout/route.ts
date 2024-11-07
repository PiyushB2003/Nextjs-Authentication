import { MongoConnect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
dotenv.config();
MongoConnect();


export async function GET(request: NextRequest){
    try {
        const response = NextResponse.json({message: "Loggout successfully", success: true}, {status: 200});

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}