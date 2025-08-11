import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, startLength = 6, endLength = 4) {
  if (!address) return ""
  if (address.length < startLength + endLength + 2) return address // +2 for '0x'
  return `${address.substring(0, startLength)}...${address.slice(-endLength)}`
}
