"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Mock User interface since StackAuth isn't available
interface User {
  id: string
  displayName: string | null
  primaryEmail: string | null
  profileImageUrl: string | null
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (provider: "google" | "github") => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const storedUser = localStorage.getItem("auth_user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Session check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (provider: "google" | "github") => {
    try {
      setLoading(true)

      // Mock login - in real app, integrate with StackAuth
      const mockUser: User = {
        id: `${provider}_${Date.now()}`,
        displayName: provider === "google" ? "John Doe" : "Jane Smith",
        primaryEmail: provider === "google" ? "john@example.com" : "jane@example.com",
        profileImageUrl: `/placeholder.svg?height=80&width=80&query=${provider} user avatar`,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("auth_user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true)

      // Mock sign up
      const mockUser: User = {
        id: `email_${Date.now()}`,
        displayName: displayName || "New Player",
        primaryEmail: email,
        profileImageUrl: `/placeholder.svg?height=80&width=80&query=user avatar`,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("auth_user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Mock sign in
      const mockUser: User = {
        id: `email_${Date.now()}`,
        displayName: "Returning Player",
        primaryEmail: email,
        profileImageUrl: `/placeholder.svg?height=80&width=80&query=user avatar`,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("auth_user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      localStorage.removeItem("auth_user")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
    signIn,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
