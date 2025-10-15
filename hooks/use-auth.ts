"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { authApi, TokenManager, type Profile } from "@/lib/api";

export function useAuth() {
  const { data: session, status } = useSession();

  const customSignIn = async (email: string, password: string) => {
    try {
      // Sign in with NextAuth using credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Authentication failed");
      }

      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const customSignUp = async (
    name: string,
    email: string,
    password: string,
    role: "USER" | "VENDOR" = "USER",
  ) => {
    try {
      // First register with our API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Then sign in with NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Registration successful but authentication failed");
      }

      return result;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const customSignOut = async () => {
    // Clear stored tokens
    TokenManager.removeToken();

    // Sign out from NextAuth
    await signOut();
  };

  const getProfile = async (): Promise<Profile | null> => {
    try {
      if (authApi.isAuthenticated()) {
        return await authApi.getProfile();
      }
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  };

  return {
    user: session?.user
      ? {
          id: session.user.id || "",
          name: session.user.name || "",
          email: session.user.email || "",
          vendor: session.user.vendor || null,
          avatar: session.user.image,
          role: session.user.role,
        }
      : null,
    loading: status === "loading",
    signIn: customSignIn,
    signUp: customSignUp,
    signOut: customSignOut,
    getProfile,
    isAuthenticated: authApi.isAuthenticated(),
  };
}
