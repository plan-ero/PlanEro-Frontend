"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Crown, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const accountTypes = [
  {
    value: "HOST",
    title: "Event Host",
    description: "I'm planning an event and looking for vendors",
    icon: User,
    features: [
      "Browse top-rated vendors",
      "Send inquiries & get quotes",
      "Manage bookings easily",
      "Save favorites to collections",
    ],
    color: "bg-blue-50/50 border-blue-200 hover:border-blue-300 hover:bg-blue-50",
    iconColor: "text-blue-600",
    ringColor: "ring-blue-500",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    value: "VENDOR",
    title: "Vendor",
    description: "I offer event services and want to showcase my business",
    icon: Building2,
    features: [
      "Create a professional profile",
      "Showcase your services",
      "Upload portfolio images",
      "Track analytics & leads",
    ],
    color: "bg-green-50/50 border-green-200 hover:border-green-300 hover:bg-green-50",
    iconColor: "text-green-600",
    ringColor: "ring-green-500",
    badgeColor: "bg-green-100 text-green-700",
  },
];

export default function SelectRoleContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user) {
      // Check if user already has a role assigned
      if (session.user.role && session.user.role !== "undefined") {
        // User already has a role, redirect appropriately
        redirectBasedOnRole(session.user.role);
        return;
      }

      // Get user info from URL params (passed from OAuth callback)
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      const image = searchParams.get("image");
      const provider = searchParams.get("provider");

      if (email) {
        setUserInfo({ email, name, image, provider });
      } else if (session.user.email) {
        setUserInfo({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          provider: "oauth",
        });
      }
    }
  }, [session, status, router, searchParams]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "VENDOR":
        router.push("/vendor/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select an account type");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          userInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update account type");
      }

      toast.success("Account type updated successfully!");

      // Redirect based on selected role
      redirectBasedOnRole(selectedRole);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-display mb-4">
            Welcome to PlanEro!
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            To personalize your experience, please tell us how you plan to use PlanEro.
          </p>

          {userInfo && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-full px-6 py-2 shadow-sm border inline-flex items-center gap-3"
            >
              {userInfo.image ? (
                <img
                  src={userInfo.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-background"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {userInfo.name?.[0] || userInfo.email?.[0]}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium">
                  Logged in as <span className="font-bold">{userInfo.name || userInfo.email}</span>
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Account Type Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
          {accountTypes.map((type, index) => {
            const Icon = type.icon;
            const isSelected = selectedRole === type.value;

            return (
              <motion.div
                key={type.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 h-full relative overflow-hidden ${isSelected
                      ? `ring-2 ${type.ringColor} shadow-lg scale-[1.02]`
                      : "hover:shadow-md hover:border-primary/20"
                    } ${type.color}`}
                  onClick={() => setSelectedRole(type.value)}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className={`rounded-full p-1 ${type.badgeColor}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center transform transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}
                      >
                        <Icon className={`w-8 h-8 ${type.iconColor}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{type.title}</CardTitle>
                    <CardDescription className="text-base">
                      {type.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 mt-4">
                      {type.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-3 ${type.iconColor.replace('text-', 'bg-')}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="ghost"
            onClick={handleSignOut}
            size="lg"
            className="text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            Sign Out
          </Button>

          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            size="lg"
            className="px-8 py-6 text-lg min-w-[200px] shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can change your account type later in your profile settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}

