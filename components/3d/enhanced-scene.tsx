"use client"

import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Suspense, type ReactNode } from "react"

interface EnhancedSceneProps {
  children: ReactNode
  environment?: string
  enableEffects?: boolean
  className?: string
}

export function EnhancedScene({
  children,
  environment = "sunset",
  enableEffects = true,
  className = "w-full h-full",
}: EnhancedSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {children}

          <Environment preset={environment as any} background={false} blur={0.6} />

          {/* Basic lighting setup since post-processing effects aren't available */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#60a5fa" />
        </Suspense>
      </Canvas>
    </div>
  )
}
