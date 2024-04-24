import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().trim().min(5, {message: "content must be atleast of 5 characters"})
            .max(300, {message: "content must be no longer than 300 characters"})
});
