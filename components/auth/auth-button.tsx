"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Github, Mail, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { AuthModal } from "./auth-modal"

export function AuthButton() {
  const { user, isAuthenticated, login, logout, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      setIsLoggingIn(true)
      await login(provider)
      toast({
        title: "Welcome! 🎉",
        description: "Successfully logged in with " + provider,
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please try again or use a different method.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged Out",
        description: "Successfully logged out. See you next time!",
      })
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Button disabled size="sm" className="relative">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Loading...
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" disabled={isLoggingIn} className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{isLoggingIn ? "Signing In..." : "Sign In"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleOAuthLogin("google")} disabled={isLoggingIn}>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  G
                </div>
                Continue with Google
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOAuthLogin("github")} disabled={isLoggingIn}>
              <Github className="mr-3 h-4 w-4" />
              Continue with GitHub
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowAuthModal(true)}>
              <Mail className="mr-3 h-4 w-4" />
              Email & Password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user?.profileImageUrl || "/placeholder.svg?height=40&width=40&query=user avatar"}
              alt={user?.displayName || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.profileImageUrl || "/placeholder.svg?height=40&width=40&query=user avatar"}
              alt={user?.displayName || "User"}
            />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{user?.displayName || "Anonymous Player"}</p>
            <p className="w-[180px] truncate text-xs text-muted-foreground">{user?.primaryEmail || "No email"}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
