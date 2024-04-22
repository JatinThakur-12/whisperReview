import dbconnect from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { sendVerificationEmai } from "@/utils/sendVerificationEmail";
import UserModel from "@/models/User";
import { generateOtp } from "@/utils/generateOtp";


export async function POST(req: NextRequest) {
    await dbconnect()
    try {

        const { username, email, password } = await req.json();
        const isExistingUser_Verified_By_Username = await UserModel.findOne({ username, isVerified: true });

        if (isExistingUser_Verified_By_Username) {// handling if username is already taken by a verified user
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        const isExistingUser_By_Email = await UserModel.findOne({ email });
        const otp = generateOtp();
        if (isExistingUser_By_Email) { // handling scenarios for already registered user
            if (isExistingUser_By_Email.isVerified) { // if user already verified with this email address
                return Response.json(
                    {
                        status: false,
                        message: "User with this email is already registered"
                    },
                    {
                        status: 400
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                isExistingUser_By_Email.password = hashedPassword;
                isExistingUser_By_Email.verificationCode = otp;

                const verificationExpiryDate = new Date();
                verificationExpiryDate.setHours(verificationExpiryDate.getHours() + 1);

                isExistingUser_By_Email.verificationCodeExpiry = verificationExpiryDate;

                await isExistingUser_By_Email.save();
            }

        } 
        
        else { // creating a newUser

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationExpiryDate = new Date();
            verificationExpiryDate.setHours(verificationExpiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verificationCode: otp,
                verificationCodeExpiry: verificationExpiryDate,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save()
        }

        //sending verification email containing otp
        const emailResponse = await sendVerificationEmai(email, username, otp);

        if (!emailResponse.success) {// Response if there is an error while sending the email 
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json(//Response is email sent successfully
            {
                success: true,
                message: "User registered successfully. Please verify your email"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error in registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error in registering user."
            },
            {
                status: 500
            }
        )
    }
};