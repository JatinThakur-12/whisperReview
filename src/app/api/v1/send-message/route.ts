import dbconnect from "@/db/dbConfig";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(req: Request) {

    await dbconnect()

    try {
        const { username, msgContent } = await req.json();

        const result = messageSchema.safeParse({ content: msgContent });
        if (!result.success) {
            const contentError = result.error.format().content?._errors || [];
            return Response.json(
                {
                    status: false,
                    message: contentError?.length > 0 ? contentError?.join(", ") : "Message content is malformed, it should be minimum of atleast 5 character and atmost 300 characters"
                }, {
                status: 400
            })
        }

        const { content } = result.data;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {
                status: 404
            })
        }
        // checking if user is accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User ts not accepting reviews right now.",
                }, {
                status: 403
            })
        }

        const newMessage = { content, createdAt: new Date() };

        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Review sent successfully"
            }, {
            status: 200
        })

    } catch (error) {
        console.log("An unexpected error occur while sending review:", error)
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            }, {
            status: 500
        })
    }
}
