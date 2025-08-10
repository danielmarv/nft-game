import type React from "react"
import { StackProvider, StackTheme } from "@stackframe/stack"
import { stackServerApp } from "@/lib/stack-auth"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/providers/wallet-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <QueryProvider>
                <WalletProvider>
                  {children}
                  <Toaster />
                </WalletProvider>
              </QueryProvider>
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  )
}
