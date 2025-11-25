"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, Crown, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight font-display">Welcome Back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
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
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="pt-6 border-t">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Are you a vendor looking to grow?
              </p>
              <Link
                href="/vendor/quick-onboarding"
                className="inline-flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Crown className="mr-2 h-4 w-4" />
                Start Quick Onboarding
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-zinc-900/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
          alt="Event Atmosphere"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white bg-gradient-to-t from-black/80 to-transparent">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "PlanEro helped us find the perfect venue for our wedding. The process was seamless and the vendors were amazing."
            </p>
            <footer className="text-sm opacity-80">— Sofia & Marcus</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

