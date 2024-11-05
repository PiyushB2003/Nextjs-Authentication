import mongoose from "mongoose";


export async function MongoConnect(){
    console.log(process.env.MONGO_URL);
    
    try {
        // mongoose.connect(process.env.MONGO_URL!);
        mongoose.connect("mongodb+srv://piyushborkar95:PiyushB2003@cluster0.qohgr.mongodb.net");
        const connect = mongoose.connection;
        connect.on("connected", () => {
            console.log("MongoDB connected");
        })
        connect.on("error", (err) => {
            console.log("MongoDB connection error" + err);
            process.exit()
        })
    } catch (error) {
        console.log("Something went wrong in connecting to DB");
        console.log(error);
    }
}