import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbconnect from "@/db/dbConfig";

export async function GET(req: Request){
    await dbconnect();
    try {
        
    } catch (error) {
        
    }
}