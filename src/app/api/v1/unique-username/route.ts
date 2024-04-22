import dbconnect from "@/db/dbConfig";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/singUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});


export async function GET(request: Request) {
    await dbconnect();
    try {

        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        //validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        // console.log("Result: ",result);
        
        if (!result.success) {
            // console.log("Zod Error:",result.error);
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Not a valid username syntax"
                }, {
                status: 400
            }
            )
        }

        const { username } = result.data;
        const exsistingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if(exsistingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                }, {
                status: 400
            }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Username is available"
            }, {
            status: 400
        }
        )

    } catch (error) {
        console.error("Error checking username", error)

        return Response.json(
            {
                success: false,
                message: "Error checking username"
            }, {
            status: 500
        }
        )
    }
}


