import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbconnect from "@/db/dbConfig";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

export async function POST(req: Request) {
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

    const userId = user._id;
    const { acceptingMessages } = await req.json();

    const result = acceptMessageSchema.safeParse({ acceptMessages: acceptingMessages });

    if (!result.success) {
        const acceptMessageError = result.error.format().acceptMessages?._errors || [];
        return Response.json(
            {
                success: false,
                message: acceptMessageError.length > 0 ? acceptMessageError?.join(", ") : "Message acceptance status must be of type boolean",
            }, {
            status: 400
        })
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptingMessages },
            { new: true }
        ).select("-password -verificationCode -verificationCodeExpiry -messages");
        console.log("Updated User Accepting Messages:", updatedUser);

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Message acceptance status updation failed."
                }, {
                status: 401
            }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully to" + acceptingMessages + ".",
                data: updatedUser
            }, {
            status: 200
        }
        )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to upadate Message acceptance status."
            }, {
            status: 500
        }
        )
    }
}

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

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {
                status: 404
            })
        }
        return Response.json(
            {
                success: true,
                message: "Status found",
                isAcceptingMessages: foundUser.isAcceptingMessages
            }, {
            status: 200
        })

    } catch (error) {
        console.log("Error->", error)
        return Response.json(
            {
                success: false,
                message: "Something went wrong while getting message Acceptance status."
            }, {
            status: 500
        })
    }

}