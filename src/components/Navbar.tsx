"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Typewriter from "typewriter-effect";

const NavBar = () => {
  const { data: session } = useSession();

  const user: User = session?.user;
  console.log("Navbar user session:", user);

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link className="text-xl font-bold mb-4 md:mb-0" href={"#"}>
          Whisper Review
        </Link>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}{" "}
            </span>
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <span className="inline">
              Welcome,{" "}
              <Typewriter
                options={{
                  loop: false,
                  autoStart: true,
                  devMode: false,
                  cursor: "",
                }}
                onInit={(typewriter) => {
                  typewriter.typeString("Stranger!").pauseFor(2000).start();
                }}
              />
            </span>
            <Link href={`/sign-in`}>
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
