"use client";

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    imageUrl: "",
    model3dUrl: "",
    inventory: 0,
    isActive: false,
    petType: "" as "cat" | "dog" | "",
  });

  const loadData = useCallback(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/products?categories=true").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: 0, categoryId: "", imageUrl: "", model3dUrl: "", inventory: 0, isActive: false, petType: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    loadData();
  };

  const editProduct = (product: any) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      model3dUrl: product.model3dUrl || "",
      inventory: product.inventory,
      isActive: product.isActive,
      petType: product.petType || "",
    });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("确认删除?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadData();
  };

  const generateDescription = async () => {
    if (!form.name) return;
    const res = await fetch("/api/ai-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "description", name: form.name, petType: form.petType }),
    });
    const data = await res.json();
    if (data.description) {
      setForm((f) => ({ ...f, description: data.description }));
    }
  };

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📦 产品管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{editing ? "编辑产品" : "添加产品"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">产品名称</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                描述
                <button
                  type="button"
                  onClick={generateDescription}
                  className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded"
                >
                  ✨ AI 生成
                </button>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">价格 (¥)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">库存</label>
                <input
                  type="number"
                  value={form.inventory}
                  onChange={(e) => setForm({ ...form, inventory: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">图片 URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">3D 模型 URL</label>
              <input
                type="url"
                value={form.model3dUrl}
                onChange={(e) => setForm({ ...form, model3dUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://.../model.glb"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">选择分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">适用宠物</label>
                <select
                  value={form.petType}
                  onChange={(e) => setForm({ ...form, petType: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">全部</option>
                  <option value="cat">🐱 猫咪</option>
                  <option value="dog">🐶 狗狗</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-sm">上架</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                {editing ? "保存" : "添加"}
              </button>
              {editing && (
                <button type="button" onClick={resetForm} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                  取消
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white border rounded-xl p-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4">产品列表</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ¥{product.price} | 库存: {product.inventory}
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {product.isActive ? "已上架" : "未上架"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editProduct(product)} className="text-sm text-blue-600 hover:text-blue-800">
                    编辑
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="text-sm text-red-600 hover:text-red-800">
                    删除
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-400 text-center py-8">暂无产品</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
