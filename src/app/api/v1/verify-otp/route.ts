import dbconnect from "@/db/dbConfig";
import UserModel from "@/models/User";

export async function POST(req: Request) {
    await dbconnect();
    try {
        const { username, otp } = await req.json();
        const user = await UserModel.findOne({ username, isVerified: false });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found, Please signup"
                }, {
                status: 500
            }
            )
        }

        const isValidOtp = user.verificationCode === otp;
        const isOtpNotExpired = new Date(user.verificationCodeExpiry) > new Date();

        if (isValidOtp && isOtpNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                }, {
                status: 200
            }
            )
        }
        else if (!isOtpNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Otp has been expired, please signup again for new otp"
                }, {
                status: 400
            }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect OTP."
                }, {
                status: 400
            }
            )
        }



    } catch (error) {
        console.error("Error verifying user", error)

        return Response.json(
            {
                success: false,
                message: "Error verifying user otp"
            }, {
            status: 500
        }
        )
    }
}