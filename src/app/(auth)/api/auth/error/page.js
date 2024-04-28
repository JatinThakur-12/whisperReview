// pages/api/auth/error.js
import { getServerSession } from "next-auth";

export default async function Page({ error }) {
    console.log("Error after server session");
    const session = await getServerSession();
    console.log("Session:",session);

    console.error("Authentication Error:", error);

    return (
        <div>
            <h1>Error during authentication </h1>
            <p> {error} </p>
        </div>
    );
}
