import UserModel from "@/models/User";
import dbconnect from "@/db/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";

type paramsType = {
  params: {
    msgId: string;
  };
};

export async function DELETE(req: Request, { params }: paramsType) {
  await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  
  // getting message id from path params
  const msgId = params.msgId;
  // console.log("Params:",params);

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      {
        status: 403,
      }
    );
  }


  try {
    const deletedMsg = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: msgId } } }
    );

    if (deletedMsg.modifiedCount == 0) {
      return Response.json(
        {
          status: false,
          message: "Message not found or already deleted",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        status: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.log("Error in deleting message",error);
    return Response.json(
        {
            success: false,
            message: "Error deleting message"
        },{
            status: 500
        }
    )
  }
}

export async function GET(req: Request, { params }: paramsType) {
  await dbconnect();
  const session = await getServerSession(authOptions);
  console.log("Server session:", session);
  console.log("Params:", params);

  return Response.json({
    message: "Bad http request method"
  },{
    status:400
  });
}
