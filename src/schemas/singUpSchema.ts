import { z } from "zod";

export const usernameValidation = z
    .string().trim()
    .min(3, "User name must be atleast of 3 charaters")
    .max(15, "Username must not be greater than 15 chararcter")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string()
                .min(6,{message: "password must be atleast of 6 characetrs"}),
});
