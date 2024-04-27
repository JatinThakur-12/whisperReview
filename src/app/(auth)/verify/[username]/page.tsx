"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsVerifying(true);
      const response = await axios.post("/api/v1/verify-otp", {
        username: params.username,
        otp: data.code,
      });

      toast({
        title: "Success",
        description: response?.data.messsage,
      });

      router.replace("/singin");
    } catch (error) {
      console.error(
        `Error while verifying otp for the user ${params.username} .`,
        error
      );
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error in verifying otp",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="flex justify-center w-full items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-slate-100 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-1">
              Verify your account
            </h1>
            <h2 className="text-lg font-medium tracking-tight lg:text-xl mb-3">
              To continue using Whisper Review
            </h2>
            {/* <p className="mb-4">
              Enter the verification code sent to your email
            </p> */}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6 "
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="border-black">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {isVerifying ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <p>Verifying...</p>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default page;
