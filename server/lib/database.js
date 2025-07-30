import mongoose from "mongoose";
import "dotenv/config"

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`);
        console.log("Database Connected Successfully.\n"+"Host :",connectionInstance.connection.host);
    }
    catch(error){
        console.log("Database Connection Failed.");
        console.log(error);
        process.exit(1);
    }
}

export {connectDB}