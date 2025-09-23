"use client"

import { useUser } from "@stackframe/stack"

export function useAuth() {
  const user = useUser()

  return {
    user,
    isAuthenticated: !!user,
    isLoading: false, // StackAuth handles loading states internally
  }
}
