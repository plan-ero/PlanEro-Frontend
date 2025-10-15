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
import { User, Building2, Crown, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import toast from "react-hot-toast";

const accountTypes = [
  {
    value: "HOST",
    title: "Event Host",
    description: "I'm planning an event and looking for vendors",
    icon: User,
    features: [
      "Browse vendors",
      "Send inquiries",
      "Manage bookings",
      "Save favorites",
    ],
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    value: "VENDOR",
    title: "Vendor",
    description: "I offer event services and want to showcase my business",
    icon: Building2,
    features: [
      "Create business profile",
      "Manage services",
      "Upload portfolio",
      "Track analytics",
    ],
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Planero!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Choose your account type to get started
          </p>

          {userInfo && (
            <div className="bg-white rounded-lg p-4 shadow-sm border inline-block">
              <div className="flex items-center space-x-3">
                {userInfo.image && (
                  <img
                    src={userInfo.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="text-left">
                  <p className="font-medium text-gray-900">
                    {userInfo.name || userInfo.email}
                  </p>
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {accountTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedRole === type.value;

            return (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all duration-200 ${type.color} ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-lg transform scale-105"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedRole(type.value)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center`}
                    >
                      <Icon className={`w-8 h-8 ${type.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{type.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {type.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 text-gray-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <Badge className="mt-4 w-full justify-center bg-blue-500 hover:bg-blue-600">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Creating Account...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleSignOut}
            size="lg"
            className="px-8 py-3 text-lg"
            disabled={loading}
          >
            Sign Out
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            You can change your account type later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
