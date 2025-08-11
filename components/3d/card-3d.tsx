"use client"

import { useRef, useState } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import * as THREE from "three"

interface Card3DProps {
  imageUrl: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  onClick?: () => void
}

export function Card3D({ imageUrl, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, onClick }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // Load the texture for the card front
  const texture = useLoader(TextureLoader, imageUrl)

  // Create a material for the front face with the texture
  const frontMaterial = new THREE.MeshStandardMaterial({ map: texture })

  // Create a material for the back and sides (e.g., a solid color)
  const backSideMaterial = new THREE.MeshStandardMaterial({ color: "#333333" }) // Dark grey for back/sides

  // Array of materials for each face of the box geometry
  // Order: Right, Left, Top, Bottom, Front, Back
  // We want the texture on the Front face (index 4)
  const materials = [
    backSideMaterial, // Right
    backSideMaterial, // Left
    backSideMaterial, // Top
    backSideMaterial, // Bottom
    frontMaterial, // Front
    backSideMaterial, // Back
  ]

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle idle rotation
      meshRef.current.rotation.y += delta * 0.1
      // Hover effect
      meshRef.current.scale.lerp(
        new THREE.Vector3(hovered ? 1.1 : 1, hovered ? 1.1 : 1, hovered ? 1.1 : 1).multiplyScalar(scale),
        0.1,
      )
      // Click effect (slight pop)
      meshRef.current.position.z = position[2] + (active ? 0.2 : 0)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={() => {
        setActive(!active)
        onClick?.()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 3, 0.1]} /> {/* Width, Height, Depth */}
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  )
}
