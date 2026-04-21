"use client";

import { useEffect, useState } from "react";
import { useDesignStore } from "@/stores/design-store";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  petType?: string;
}

export function ClothingPicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedClothing, setSelectedClothing } = useDesignStore();

  useEffect(() => {
    fetch("/api/products?active=true")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">加载服装...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">选择服装</h2>
      <div className="space-y-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedClothing(product.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedClothing === product.id
                ? "border-indigo-500 bg-indigo-50"
                : "hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-indigo-600 font-semibold">¥{product.price}</p>
              </div>
            </div>
          </button>
        ))}
        {products.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            暂无服装，请先在后台管理添加产品
          </p>
        )}
      </div>
    </div>
  );
}
