// import { Form } from "@/components/ui/form";
import { Suspense } from "react";
import { SigninForm } from "../../../mycomponents/forms/sign-in";

export default function SignInPage() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
}
