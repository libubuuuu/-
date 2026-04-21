"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePetStore } from "@/stores/pet-store";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { petName, setPetName, species, setSpecies } = usePetStore();
  const router = useRouter();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleGenerate3D = useCallback(async () => {
    if (!imageUrl) return;
    setGenerating(true);
    setProgress(0);

    try {
      const res = await fetch("/api/3d-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, skeletonType: species }),
      });
      const data = await res.json();

      if (data.jobId) {
        const poll = setInterval(async () => {
          setProgress((p) => Math.min(p + 10, 90));
          const statusRes = await fetch(`/api/3d-status?jobId=${data.jobId}`);
          const status = await statusRes.json();

          if (status.status === "completed") {
            clearInterval(poll);
            setProgress(100);
            usePetStore.getState().setModelUrl(status.modelUrl);
            setTimeout(() => router.push("/design"), 500);
          } else if (status.status === "failed") {
            clearInterval(poll);
            setGenerating(false);
          }
        }, 2000);
      }
    } catch (err) {
      console.error("3D generation failed:", err);
      setGenerating(false);
    }
  }, [imageUrl, species, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">📸 上传宠物照片</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">宠物名字</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="给宠物取个名字"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">宠物类型</label>
          <div className="flex gap-4">
            <button
              onClick={() => setSpecies("cat")}
              className={`flex-1 py-3 rounded-lg border transition-colors ${species === "cat" ? "bg-indigo-50 border-indigo-500" : "hover:bg-gray-50"}`}
            >
              🐱 猫咪
            </button>
            <button
              onClick={() => setSpecies("dog")}
              className={`flex-1 py-3 rounded-lg border transition-colors ${species === "dog" ? "bg-indigo-50 border-indigo-500" : "hover:bg-gray-50"}`}
            >
              🐶 狗狗
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">上传照片</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            {imageUrl ? (
              <div>
                <img src={imageUrl} alt="pet" className="max-h-64 mx-auto rounded-lg mb-4" />
                <button
                  onClick={handleGenerate3D}
                  disabled={generating}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {generating ? "生成中..." : "生成 3D 模型"}
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="text-4xl mb-4">📷</div>
                <p className="text-gray-500 mb-2">点击或拖拽上传照片</p>
                <p className="text-sm text-gray-400">支持 JPG, PNG 格式</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <span className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">
                  选择照片
                </span>
              </label>
            )}
          </div>
        </div>

        {generating && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-spin text-xl">⚙️</div>
              <span>AI 正在生成 3D 模型...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
