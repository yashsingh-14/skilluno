'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'

function AnimatedSphere() {
    return (
        <Sphere visible args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial
                color="#8352FD"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0}
            />
        </Sphere>
    )
}

export default function HeroScene() {
    return (
        <div className="h-[500px] w-full">
            <Canvas>
                <OrbitControls enableZoom={false} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[-2, 5, 2]} intensity={1} />
                <AnimatedSphere />
            </Canvas>
        </div>
    )
}
