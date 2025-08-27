"use client"

import React, { useEffect, useRef, useState } from "react"
import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem"
import { Texture } from "@babylonjs/core/Materials/Textures/texture"
import { Vector3, Color4, Color3, HemisphericLight, MeshBuilder, SceneLoader } from "@babylonjs/core"

interface PetNFT {
  id: string
  name: string
  glbUrl: string
  type: number // 1 = Pet, 2 = Unicorn, 3 = Dragon
}

const MOCK_PETS: PetNFT[] = [
  { id: "1", name: "Dragon", glbUrl: "https://assets.babylonjs.com/meshes/dragon.glb", type: 3 },
  { id: "2", name: "Unicorn", glbUrl: "https://assets.babylonjs.com/meshes/HVGirl.glb", type: 2 },
  { id: "3", name: "Pet", glbUrl: "https://assets.babylonjs.com/meshes/cutePet.glb", type: 1 },
]

export default function NFTPetGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const petMeshesRef = useRef<BABYLON.AbstractMesh | null>(null)
  const animGroupRef = useRef<BABYLON.AnimationGroup | null>(null)

  const [pets] = useState<PetNFT[]>(MOCK_PETS)
  const [selectedPet, setSelectedPet] = useState<PetNFT | null>(MOCK_PETS[0])
  const [happiness, setHappiness] = useState<number>(70)
  const [energy, setEnergy] = useState<number>(80)

  // Load pet model & animation
  const loadPet = (pet: PetNFT) => {
    if (!sceneRef.current) return
    const scene = sceneRef.current

    if (petMeshesRef.current) {
      petMeshesRef.current.dispose()
      animGroupRef.current?.stop()
    }

    SceneLoader.ImportMeshAsync("", pet.glbUrl, "", scene).then((result) => {
      const mesh = result.meshes[0]
      mesh.scaling.scaleInPlace(pet.type === 3 ? 0.15 : 0.08)
      mesh.position.y = 0
      mesh.position.z = 0
      petMeshesRef.current = mesh

      // Play idle animation
      let animGroup = result.animationGroups.find(a => a.name === "Idle") || result.animationGroups[0]

      // Dragon can have Fly animation
      if (pet.type === 3) {
        const flyAnim = result.animationGroups.find(a => a.name === "Fly")
        animGroup = flyAnim || animGroup
      }

      animGroup?.start(true)
      animGroupRef.current = animGroup
    })
  }

  // Initialize Babylon scene
  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new Engine(canvasRef.current, true)
    const scene = new BABYLON.Scene(engine)
    sceneRef.current = scene
    scene.clearColor = new Color4(0, 0, 0, 1)

    // Camera
    const camera = new ArcRotateCamera("cam", Math.PI / 2, Math.PI / 3, 6, Vector3.Zero(), scene)
    camera.attachControl(canvasRef.current, true)

    // Light
    new HemisphericLight("hemi", new Vector3(0, 1, 0), scene)

    // Ground
    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene)

    // Load initial pet
    if (selectedPet) loadPet(selectedPet)

    engine.runRenderLoop(() => {
      scene.render()
    })

    return () => engine.dispose()
  }, [])

  // Handle pet change
  useEffect(() => {
    if (selectedPet) loadPet(selectedPet)
  }, [selectedPet])

  // Pet interactions
  const interact = (action: "hug" | "feed" | "play") => {
    if (!petMeshesRef.current || !sceneRef.current) return

    let newHappiness = happiness
    let newEnergy = energy

    switch (action) {
      case "hug":
        newHappiness = Math.min(100, happiness + 10)
        break
      case "feed":
        newEnergy = Math.min(100, energy + 20)
        newHappiness = Math.min(100, happiness + 5)
        break
      case "play":
        newHappiness = Math.min(100, happiness + 15)
        newEnergy = Math.max(0, energy - 10)
        // Dragon particle effect
        if (selectedPet?.type === 3) {
          const fire = new ParticleSystem("fire", 500, sceneRef.current)
          fire.particleTexture = new Texture("https://assets.babylonjs.com/particles/fire.png", sceneRef.current)
          fire.emitter = petMeshesRef.current.position.clone()
          fire.start()
          setTimeout(() => fire.stop(), 500)
        }
        break
    }

    setHappiness(newHappiness)
    setEnergy(newEnergy)

    // Small bounce animation
    const mesh = petMeshesRef.current
    if (mesh) {
      const anim = new BABYLON.Animation("pop", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
      anim.setKeys([
        { frame: 0, value: mesh.position.y },
        { frame: 10, value: mesh.position.y + 0.3 },
        { frame: 20, value: mesh.position.y },
      ])
      mesh.animations = [anim]
      sceneRef.current?.beginAnimation(mesh, 0, 20, false)
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-black flex flex-col items-center justify-center">
      {/* Pet selection menu */}
      {pets.length > 1 && (
        <div className="absolute top-4 left-4 flex gap-2 bg-white/10 p-2 rounded-lg z-10">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`px-3 py-1 rounded ${selectedPet?.id === pet.id ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-3/4" />

      {/* Interaction buttons */}
      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-red-500 rounded text-white" onClick={() => interact("hug")}>Hug</button>
        <button className="px-4 py-2 bg-green-500 rounded text-white" onClick={() => interact("feed")}>Feed</button>
        <button className="px-4 py-2 bg-blue-500 rounded text-white" onClick={() => interact("play")}>Play</button>
      </div>

      {/* Stats display */}
      <div className="flex gap-6 mt-4 text-white">
        <div>Happiness: {happiness}</div>
        <div>Energy: {energy}</div>
      </div>
    </div>
  )
}
