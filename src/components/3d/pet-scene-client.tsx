"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { usePetStore } from "@/stores/pet-store";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

function FallbackModel() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  );
}

export function PetSceneClient() {
  const { modelUrl, species } = usePetStore();

  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} />

      {modelUrl ? (
        <Model url={modelUrl} />
      ) : (
        <FallbackModel />
      )}

      <OrbitControls
        enableDamping
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2 + 0.3}
      />

      <Environment preset="studio" />

      <gridHelper args={[10, 10, "#333", "#222"]} />

      {!modelUrl && (
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#f5d5a0" transparent opacity={0.8} />
        </mesh>
      )}
    </Canvas>
  );
}
