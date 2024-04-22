import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection:ConnectionObject = {}; 

export default async function dbconnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.DATABASE_URI || "");

        connection.isConnected = db.connections[0].readyState;
        // console.log("DB",db);
        console.log(" Db connections",connection.isConnected);

    } catch (error) {
        console.log("Databse connection failed",error);
        
        process.exit(1)
    }
}