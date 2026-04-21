"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  petType?: string;
  aiTags?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/products?active=true")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    const stored = localStorage.getItem("cart");
    const cart = stored ? JSON.parse(stored) : [];
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("已加入购物车!");
  };

  const filtered = filter === "all" ? products : products.filter((p) => p.petType === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">🛍️ 商城</h1>

      <div className="flex gap-3 mb-6">
        {["all", "cat", "dog"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "全部" : f === "cat" ? "🐱 猫咪" : "🐶 狗狗"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-3" />
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
              <div className="bg-gray-200 h-4 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">👗</div>
          <p>暂无商品，请先在后台管理添加产品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-100 overflow-hidden">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{product.name}</h3>
                {product.aiTags && (
                  <div className="flex gap-1 mb-2">
                    {product.aiTags.split(",").slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">¥{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
