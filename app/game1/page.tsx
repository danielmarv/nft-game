"use client"

import React, { useEffect, useRef, useState } from "react"
import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
import { usePetInteraction, PetNFT } from "@/hooks/use-pet-interaction"

const MOCK_PETS: PetNFT[] = [
  { id: "1", name: "Dragon", glbUrl: "https://assets.babylonjs.com/meshes/HVGirl.glb", type: 2 },
  { id: "2", name: "Unicorn", glbUrl: "https://assets.babylonjs.com/meshes/HVGirl.glb", type: 2 },
]

export default function NFTPetGameAdvanced() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<BABYLON.Engine | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const petMeshesRef = useRef<BABYLON.AbstractMesh | null>(null)
  const animGroupRef = useRef<BABYLON.AnimationGroup | null>(null)

  const { selectedPetId, petsStats, interact, selectPet } = usePetInteraction(MOCK_PETS)
  const selectedPet = MOCK_PETS.find((p) => p.id === selectedPetId) || MOCK_PETS[0]
  const selectedStats = petsStats[selectedPetId]

  // Initialize Babylon scene
  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new BABYLON.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true })
    engineRef.current = engine
    const scene = new BABYLON.Scene(engine)
    sceneRef.current = scene

    // Camera
    const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 3, 6, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvasRef.current, true)
    camera.wheelDeltaPercentage = 0.01

    // Light
    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene)
    hemi.intensity = 0.8

    // Ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene)
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene)
    groundMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.15)
    ground.material = groundMat

    // Floating particle system
    const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene)
    particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/particles/flare.png", scene)
    particleSystem.minEmitBox = new BABYLON.Vector3(-5, 0, -5)
    particleSystem.maxEmitBox = new BABYLON.Vector3(5, 5, 5)
    particleSystem.color1 = new BABYLON.Color4(0.5, 0.8, 1, 1)
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1)
    particleSystem.minSize = 0.05
    particleSystem.maxSize = 0.15
    particleSystem.minLifeTime = 2
    particleSystem.maxLifeTime = 5
    particleSystem.emitRate = 10
    particleSystem.start()

    engine.runRenderLoop(() => scene.render())
    return () => engine.dispose()
  }, [])

  // Load or switch pet
  useEffect(() => {
    if (!selectedPet || !sceneRef.current) return
    const scene = sceneRef.current

    if (petMeshesRef.current) {
      petMeshesRef.current.dispose()
      animGroupRef.current?.stop()
    }

    BABYLON.SceneLoader.ImportMeshAsync("", selectedPet.glbUrl, "", scene).then((result) => {
      const mesh = result.meshes[0]
      mesh.scaling.scaleInPlace(0.08)
      mesh.position.y = 0
      mesh.position.z = 0
      petMeshesRef.current = mesh

      // Idle animation: either named "Idle" or first animation
      const animGroup = scene.getAnimationGroupByName("Idle") || result.animationGroups[0]
      animGroup?.start(true)
      animGroupRef.current = animGroup
    })
  }, [selectedPet])

  // Interaction effect
  const handleInteraction = (action: "hug" | "feed" | "play") => {
    interact(action)
    if (!sceneRef.current || !petMeshesRef.current) return
    const scene = sceneRef.current

    // Bounce animation
    const anim = new BABYLON.Animation("bounce", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
    const startY = petMeshesRef.current.position.y
    anim.setKeys([
      { frame: 0, value: startY },
      { frame: 10, value: startY + 0.3 },
      { frame: 20, value: startY },
    ])
    petMeshesRef.current.animations = [anim]
    scene.beginAnimation(petMeshesRef.current, 0, 20, false)

    // Particle burst
    const burst = new BABYLON.ParticleSystem("burst", 500, scene)
    burst.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/particles/flare.png", scene)
    burst.emitter = petMeshesRef.current.position.clone()
    burst.minEmitBox = new BABYLON.Vector3(0, 0, 0)
    burst.maxEmitBox = new BABYLON.Vector3(0, 0, 0)
    burst.color1 = new BABYLON.Color4(1, 0.5, 0.5, 1)
    burst.color2 = new BABYLON.Color4(1, 1, 0, 1)
    burst.minSize = 0.05
    burst.maxSize = 0.15
    burst.minLifeTime = 0.5
    burst.maxLifeTime = 1
    burst.emitRate = 100
    burst.direction1 = new BABYLON.Vector3(-1, 1, -1)
    burst.direction2 = new BABYLON.Vector3(1, 1, 1)
    burst.start()
    setTimeout(() => burst.stop(), 300)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-black flex flex-col relative">
      {/* Pet selection menu */}
      {MOCK_PETS.length > 1 && (
        <div className="absolute top-4 left-4 flex gap-2 bg-white/10 p-2 rounded-lg z-10">
          {MOCK_PETS.map((pet) => (
            <button
              key={pet.id}
              onClick={() => selectPet(pet.id)}
              className={`px-3 py-1 rounded ${selectedPetId === pet.id ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {/* Interaction buttons */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-white/10 p-2 rounded-lg z-10">
        <button onClick={() => handleInteraction("hug")} className="px-3 py-1 rounded bg-pink-500 text-white">
          Hug
        </button>
        <button onClick={() => handleInteraction("feed")} className="px-3 py-1 rounded bg-green-500 text-white">
          Feed
        </button>
        <button onClick={() => handleInteraction("play")} className="px-3 py-1 rounded bg-yellow-500 text-black">
          Play
        </button>
      </div>

      {/* Stats display */}
      {selectedStats && (
        <div className="absolute bottom-4 right-4 bg-white/10 p-2 rounded-lg text-white z-10">
          <div>Happiness: {selectedStats.happiness}</div>
          <div>Hunger: {selectedStats.hunger}</div>
          <div>Energy: {selectedStats.energy}</div>
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ flex: 1 }} />
    </div>
  )
}
