import { NextRequest, NextResponse } from "next/server"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authApi } from "@/lib/api"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Use the external API for authentication
          const authResponse = await authApi.login({
            username: credentials.username as string,
            password: credentials.password as string,
          })

          // Get user profile from the external API
          const profile = await authApi.getProfile(authResponse.token)

          return {
            id: profile.email,
            email: profile.email,
            name: profile.username,
            image: profile.vendor?.profilePictureUrl || null,
            role: profile.role,
            token: authResponse.token,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, store user info and API token
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.apiToken = (user as any).token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
        // Store API token in session for API calls
        ;(session as any).apiToken = token.apiToken
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export const GET = handlers.GET
export const POST = handlers.POST
