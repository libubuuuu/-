"use client";

import { useState } from "react";
import { useDesignStore } from "@/stores/design-store";
import { designAssistant } from "@/lib/ai/services/design-assistant";
import { usePetStore } from "@/stores/pet-store";

const FABRICS = [
  { id: "cotton", name: "纯棉", desc: "柔软透气，四季适用" },
  { id: "linen", name: "亚麻", desc: "轻薄凉爽，夏季首选" },
  { id: "wool", name: "羊毛", desc: "保暖御寒，冬季必备" },
  { id: "silk", name: "丝绸", desc: "光滑亮丽，适合特殊场合" },
];

const ACCESSORIES = [
  { id: "hat", name: "帽子", emoji: "🎩" },
  { id: "collar", name: "项圈", emoji: "📿" },
  { id: "bow", name: "蝴蝶结", emoji: "🎀" },
  { id: "scarf", name: "围巾", emoji: "🧣" },
];

export default function DIYPage() {
  const { selectedFabric, setSelectedFabric, selectedAccessories, toggleAccessory, color, setColor } = useDesignStore();
  const { species } = usePetStore();
  const [suggestions, setSuggestions] = useState<any>(null);

  const getAISuggestions = () => {
    const base = selectedFabric ? FABRICS.find((f) => f.id === selectedFabric)?.name : "basic t-shirt";
    designAssistant.getSuggestions(species, base).then(setSuggestions);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🎨 自定义设计</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-xl min-h-[400px]">
          {/* 3D preview area */}
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🐾</div>
              <p>选择布料和配件后，这里会显示预览</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">选择布料</h2>
            <div className="grid grid-cols-2 gap-3">
              {FABRICS.map((fabric) => (
                <button
                  key={fabric.id}
                  onClick={() => setSelectedFabric(fabric.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    selectedFabric === fabric.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium">{fabric.name}</p>
                  <p className="text-xs text-gray-500">{fabric.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">选择配件</h2>
            <div className="flex gap-3">
              {ACCESSORIES.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => toggleAccessory(acc.id)}
                  className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                    selectedAccessories.includes(acc.id)
                      ? "border-indigo-500 bg-indigo-50"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl">{acc.emoji}</div>
                  <p className="text-sm mt-1">{acc.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">颜色</h2>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0"
              />
              <span className="text-sm text-gray-600">{color}</span>
            </div>
          </div>

          <div>
            <button
              onClick={getAISuggestions}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              ✨ 获取 AI 搭配建议
            </button>
            {suggestions && (
              <div className="mt-3 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium mb-2">AI 推荐:</p>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(suggestions, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
