import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verificationCode: string;
    verificationCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
            match: [/.+\@.+\..+/, "please give a valid email address"],
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        verificationCode: {
            type: String,
            required: [true, "verification code is required"]
        },
        verificationCodeExpiry: {
            type: Date,
            required: [true, "verificationCodeExpiry is required"]
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAcceptingMessages: {
            type: Boolean,
            default: true
        },
        messages: [MessageSchema]
    },
    {
        timestamps: true
    }
)

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel