"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const data = (error as any)?.data;
    if (data) {
      if (typeof data === "string") return data;
      if (typeof data === "object" && data.message) return data.message;
      if (typeof data === "object") {
        const msgs: string[] = [];
        for (const key of Object.keys(data)) {
          const field = data[key];
          if (field?._errors?.length) msgs.push(...field._errors);
        }
        if (msgs.length) return msgs.join(" ");
      }
    }
    const clean = error.message.replace(/\[Request ID:[^\]]+\]\s*Server Error\s*/i, "").trim();
    if (clean) return clean;
  }
  return "Something went wrong. Please try again.";
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (values: SignupFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("flow", "signUp");

        await signIn("password", formData);

        toast.success("Account created!", {
          description: "Welcome! You have successfully signed up.",
        });

        router.push("/");
      } catch (error) {
        toast.error("Sign up failed", {
          description: getAuthErrorMessage(error),
        });
      }
    });
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-2">Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup >

            {/* Full Name */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email ? (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              )}
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password ? (
                <FieldDescription className="text-red-500">
                  {errors.password.message}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              )}
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <FieldDescription className="text-red-500">
                  {errors.confirmPassword.message}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              )}
            </Field>

            {/* Actions */}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
                {/* <Button
                  variant="outline"
                  type="button"
                  onClick={() => signIn("google")}
                  disabled={isPending}
                >
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}