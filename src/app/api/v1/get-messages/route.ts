import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbconnect from "@/db/dbConfig";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            }, {
            status: 401
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if(!userMessages || userMessages.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {
                status: 401
            })
        }

        return Response.json(
            {
                success: true,
                message: userMessages[0].messages
            }, {
            status: 200
        });
    } catch (error) {
        console.log("An unexpected error occur: ",error)
        return Response.json(
            {
                success: false,
                message: "Something went wrong while retreiving user messages"
            }, {
            status: 500
        })
    }
}