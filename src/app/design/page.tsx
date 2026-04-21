import { Suspense } from "react";
import { PetScene } from "@/components/3d/pet-scene";
import { ClothingPicker } from "@/components/design/clothing-picker";

export default function DesignPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      <div className="flex-1 bg-gray-900 relative">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">加载 3D 场景中...</div>}>
          <PetScene />
        </Suspense>
      </div>
      <div className="w-80 border-l bg-white overflow-y-auto">
        <ClothingPicker />
      </div>
    </div>
  );
}
