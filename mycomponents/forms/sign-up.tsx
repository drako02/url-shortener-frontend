"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import googleIcon from "@/public/icons/google.svg";
import { useAuth } from "@/app/context/Auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addUser } from "@/api/users/add";
import { useState } from "react";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
  email: z
    .string()
    .min(5, "Email must be at least 5 characters")
    .max(50, "Email must be less than 50 characters")
    .email("Please enter a valid email address")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
export const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { createAccount, user, signIn } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log({ user });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    try {
      const newUser = await createAccount(email, password);
      if (!newUser) {
        return;
      }
      await addUser({ uid: newUser.uid });
      router.push("/home");
      console.log("submitted");
    } catch (error) {
      console.error("Failed to sign up", error);
      const errMessage =
        error instanceof FirebaseError ? error.message : "Something went wrong";
      toast(`${errMessage}`);
    } finally{
      setLoading(false)
    }
  };

  const onGoogleSignIn = async () => {
    const newUser = await signIn({ option: "google" });
    if (!newUser) {
      return;
    }
    const res = await addUser({ uid: newUser.uid });
    console.log({ res });
    router.push("/home");
  };
  return (
    <div className="w-[360px] ">
      <p className="text-[28px] text-center font-medium"> Create an account</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[10px] w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <div className="flex justify-start items-center">
            <Button type="submit" className=" mt-[20px]">
              {" "}
              Sign up
            </Button>
          </div>
        </form>
      </Form>
      <div className="w-full">
        <div className="flex items-center gap-4 my-4 w-full">
          <hr className="flex-grow border-gray-300" />
          <p className="text-gray-500 text-sm">or continue with google</p>
          <hr className="flex-grow border-gray-300" />
        </div>
        <Button className="w-full" variant="outline" onClick={onGoogleSignIn}>
          <Image alt="" src={googleIcon} className="h-[24px] w-[24px]" /> Google{" "}
        </Button>
      </div>
      <Link
        href="/sign-in"
        className="text-gray-500 text-sm underline flex justify-center mt-5"
      >
        Already have an account? Sign in here
      </Link>
    </div>
  );
};
