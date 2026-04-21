"use client";

import dynamic from "next/dynamic";

const PetSceneClient = dynamic(() => import("@/components/3d/pet-scene").then((m) => ({ default: m.PetSceneClient })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-gray-400">
      加载 3D 场景中...
    </div>
  ),
});

export function PetScene() {
  return <PetSceneClient />;
}
