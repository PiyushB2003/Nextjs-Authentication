import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        const decodedToken: any = jwt.verify(token, "mynameispiyush");
        return decodedToken.id;
    } catch (error: any) {
        console.log("Error while getDataFromToken");
        
        throw new Error(error.message)
    }
}