"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      PENDING: "待处理",
      CONFIRMED: "已确认",
      PROCESSING: "处理中",
      SHIPPED: "已发货",
      DELIVERED: "已送达",
      CANCELLED: "已取消",
      REFUNDED: "已退款",
    };
    return map[s] || s;
  };

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📋 订单管理</h1>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-16">暂无订单</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">订单号</th>
                <th className="text-left p-3">金额</th>
                <th className="text-left p-3">支付</th>
                <th className="text-left p-3">状态</th>
                <th className="text-left p-3">日期</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.orderNumber}</td>
                  <td className="p-3">¥{order.totalAmount}</td>
                  <td className="p-3">{order.paymentMethod || "未支付"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-100">{statusLabel(order.status)}</span>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString("zh-CN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
