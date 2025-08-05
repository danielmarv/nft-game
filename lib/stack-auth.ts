"use client"

import { StackClientApp } from "@stackframe/stack"

export const stackServerApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    afterSignIn: "/",
    afterSignUp: "/",
    signUp: "/auth/signup",
  },
})
