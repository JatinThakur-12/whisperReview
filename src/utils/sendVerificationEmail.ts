import { resend } from "./resend";
import VerificationEmail from "@/emailTemplates/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmai(email: string, username: string, verificationCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Whisper Review account verification',
            react: VerificationEmail({ username, otp: verificationCode }),
        });
        return { success: true, message: "Verification email sent" }
    } catch (emailError) {
        console.error("Error in sending verification email", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}