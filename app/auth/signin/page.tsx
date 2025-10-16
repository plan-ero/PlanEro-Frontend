"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Mail, Crown } from "lucide-react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Welcome back!");

        // Redirect based on user role
        // The role will be available in the session after successful sign-in
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const profile = await response.json();
          if (profile.role === "VENDOR") {
            router.push("/vendor/dashboard");
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your PlanEro account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

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
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" onClick={handleGitHubSignIn}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-center text-sm border-t pt-4">
            <p className="text-muted-foreground mb-2">
              New vendor? Get started quickly!
            </p>
            <Link
              href="/vendor/quick-onboarding-v2"
              className="text-purple-600 hover:underline font-medium flex items-center justify-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Quick Vendor Onboarding
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
