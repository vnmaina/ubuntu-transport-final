"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";
import Link from "next/link";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // ConvexError stores the message in error.message, sometimes prefixed with "[Request ID: ...] Server Error"
    // The actual cause is in error.message after the prefix, or in (error as any).data
    const data = (error as any)?.data;
    if (data) {
      if (typeof data === "string") return data;
      if (typeof data === "object" && data.message) return data.message;
      // Zod error format from ConvexError(error.format())
      if (typeof data === "object") {
        const msgs: string[] = [];
        for (const key of Object.keys(data)) {
          const field = data[key];
          if (field?._errors?.length) msgs.push(...field._errors);
        }
        if (msgs.length) return msgs.join(" ");
      }
    }
    // Strip the [Request ID: ...] Server Error prefix if present
    const clean = error.message.replace(/\[Request ID:[^\]]+\]\s*Server Error\s*/i, "").trim();
    if (clean) return clean;
  }
  return "Something went wrong. Please try again.";
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("flow", "signIn");

        await signIn("password", formData);

        toast.success("Welcome back!", {
          description: "You have successfully logged in.",
        });

        router.push("/");
      } catch (error) {
        toast.error("Login failed", {
          description: getAuthErrorMessage(error),
        });
      }
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        await signIn("google");
        toast.success("Welcome!", {
          description: "You have successfully logged in with Google.",
        });
      } catch (error) {
        toast.error("Google login failed", {
          description: getAuthErrorMessage(error),
        });
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2">Login to your Account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isPending}
                />
                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isPending}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Actions */}
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                {/* <Button
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  onClick={handleGoogleSignIn}
                >
                  {isPending ? "Please wait..." : "Login with Google"}
                </Button> */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}