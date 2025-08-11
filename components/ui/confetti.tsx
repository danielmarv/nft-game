"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

interface ConfettiProps {
  duration?: number
  colors?: string[]
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
}

const Confetti: React.FC<ConfettiProps> = ({
  duration = 3000,
  colors = ["#a78bfa", "#e879f9", "#22d3ee"], // Tailwind purple, fuchsia, cyan
  particleCount = 100,
  spread = 90,
  origin = { x: 0.5, y: 0.8 }, // From bottom-center
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiInstance = useRef<confetti.Confetti | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      confettiInstance.current = confetti.create(canvasRef.current, {
        resize: true,
        useFetti: true,
      })
    }

    const fireConfetti = () => {
      if (confettiInstance.current) {
        confettiInstance.current({
          particleCount,
          spread,
          origin,
          colors,
          disableForReducedMotion: true,
        })
      }
    }

    fireConfetti()

    const timeout = setTimeout(() => {
      if (confettiInstance.current) {
        // No explicit stop method, but particles will naturally fall
        // You might clear the canvas if needed, but confetti handles its own lifecycle
      }
    }, duration)

    return () => {
      clearTimeout(timeout)
      if (confettiInstance.current) {
        // Attempt to clear any lingering animations if possible
        // confettiInstance.current.reset(); // Not a standard method, but some forks might have it
      }
    }
  }, [duration, colors, particleCount, spread, origin])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  )
}

export default Confetti
