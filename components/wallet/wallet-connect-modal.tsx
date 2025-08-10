"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Chrome, Smartphone } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connect } = useWallet()

  const walletOptions = [
    {
      name: "MetaMask",
      description: "Connect using MetaMask browser extension",
      icon: <Chrome className="h-6 w-6" />,
      id: "metamask",
    },
    {
      name: "WalletConnect",
      description: "Connect using WalletConnect protocol",
      icon: <Smartphone className="h-6 w-6" />,
      id: "walletconnect",
    },
  ]

  const handleConnect = async (walletId: string) => {
    try {
      await connect(walletId)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>Choose a wallet to connect to the platform and access Web3 features.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <Card key={wallet.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  {wallet.icon}
                  {wallet.name}
                </CardTitle>
                <CardDescription className="text-sm">{wallet.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button onClick={() => handleConnect(wallet.id)} className="w-full" variant="outline">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
