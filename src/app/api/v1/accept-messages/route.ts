import UserModel from "@/models/User";
import dbconnect from "@/db/dbConfig";

export async function POST(req: Request){
    await dbconnect();
    try {
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Something went wrong "
            }, {
            status: 500
        }
        )
    }
}