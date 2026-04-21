"use client";

import { useEffect, useState, useCallback } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(() => {
    const stored = localStorage.getItem("cart");
    setItems(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
      .filter((item) => item.quantity > 0);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">🛒 购物车</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🛒</div>
          <p>购物车是空的，去商城逛逛吧！</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-indigo-600">¥{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600">合计</p>
              <p className="text-2xl font-bold text-indigo-600">¥{total.toFixed(2)}</p>
            </div>
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              去结算
            </button>
          </div>
        </>
      )}
    </div>
  );
}
