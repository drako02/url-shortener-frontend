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
export const SigninForm = () => {
  const { signIn } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    await signIn({option: "email_password", email, password});
    router.push("/home");
    console.log("submitted");
  };

  const onGoogleSignIn = async () =>  {
    await signIn({option: "google"})
    router.push("/home");
  }
  return (
    <div className="w-[360px] ">
      <p className="text-[28px] text-center font-medium"> Sign in here</p>
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
                  <Input placeholder="Enter email" />
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
                  <Input placeholder="Enter password" />
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
              Sign in
            </Button>
          </div>
        </form>
      </Form>
      <div className="w-full">
        <div className="flex items-center gap-4 my-4 w-full">
          <hr className="flex-grow border-gray-300" />
          <p className="text-gray-500 text-sm">Or Sign in with google</p>
          <hr className="flex-grow border-gray-300" />
        </div>
        <Button className="w-full" variant="outline" onClick={onGoogleSignIn}>
          <Image alt="" src={googleIcon} className="h-[24px] w-[24px]" /> Google{" "}
        </Button>
      </div>
    </div>
  );
};
