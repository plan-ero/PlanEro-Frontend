"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TransitionLink as Link } from "@/components/transition-link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Github, Mail, Building2, User, Crown, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Validation schema that matches backend requirements
const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["USER", "VENDOR"], {
      required_error: "Please select an account type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    },
  });

  const handleSubmit = async (data: SignupFormData) => {
    setLoading(true);

    try {
      // Register the user using the new API
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          role: data.role,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();

        // Handle field-specific errors from backend
        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            form.setError(field as keyof SignupFormData, {
              type: "server",
              message: message as string,
            });
          });
          return;
        }

        toast.error(error.error || "Registration failed");
        return;
      }

      // After successful registration, sign in the user
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(
          "Registration successful, but sign-in failed. Please try signing in manually.",
        );
      } else {
        toast.success("Account created successfully!");

        // Redirect based on role
        if (data.role === "VENDOR") {
          router.push("/vendor/onboarding");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/auth/select-role" });
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/auth/select-role" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 py-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight font-display">Create Account</h1>
            <p className="text-muted-foreground">
              Join PlanEro to start planning your perfect event
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Choose a username"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Create password"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm password"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Event Host</p>
                              <p className="text-xs text-muted-foreground">
                                Planning an event
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="VENDOR">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Vendor</p>
                              <p className="text-xs text-muted-foreground">
                                Offering event services
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn} className="h-11">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" onClick={handleGitHubSignIn} className="h-11">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>

          <div className="pt-4 border-t">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Vendor looking for quick setup?
              </p>
              <Link
                href="/vendor/quick-onboarding"
                className="inline-flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Crown className="mr-2 h-4 w-4" />
                Try Quick Onboarding
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-zinc-900/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
          alt="Event Celebration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white bg-gradient-to-t from-black/80 to-transparent">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "The best decision we made for our corporate event. PlanEro simplified everything from venue selection to catering."
            </p>
            <footer className="text-sm opacity-80">— David Chen, Event Director</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

