"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Typewriter from "typewriter-effect";

const page = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <>
      <div className="flex justify-center w-full items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-slate-100 rounded-lg shadow-md">
          <div className="text-center">
            {/* <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
              Welcome Back to Whisper Review!{" "}
            </h1> */}
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-extrabold tracking-tight">W</span>
              <div className=" text-4xl leading-snug font-extrabold tracking-tight">
                <Typewriter
                  options={{
                    loop: true,
                    autoStart: true,
                    devMode: false,
                    cursor: "<span class='' >_</span>",
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("elcome Back to")
                      .pauseFor(500)
                      .deleteAll()
                      .typeString("hisper Review")
                      .pauseFor(2500)
                      .deleteAll()
                      .start();
                  }}
                />
              </div>
            </div>
            <p className="mb-4 text-sm">
              Your anonymous review adventure is just a step away!
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username/Email"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{"Login"}</Button>
            </form>
          </Form>
          <p className="text-center text-sm">
            Don't have an account? &nbsp;
            <Link
              className="text-blue-600 hover:text-blue-800"
              href={"/signup"}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
