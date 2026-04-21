import Link from "next/link";
import { prisma } from "@/lib/db";

async function getStats() {
  const [products, orders, designs] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.design.count(),
  ]);
  return { products, orders, designs };
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">📊 后台管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500 text-sm">产品数量</p>
          <p className="text-4xl font-bold mt-2">{stats.products}</p>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500 text-sm">订单数量</p>
          <p className="text-4xl font-bold mt-2">{stats.orders}</p>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500 text-sm">设计方案</p>
          <p className="text-4xl font-bold mt-2">{stats.designs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/products" className="block p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
          <h3 className="text-lg font-semibold">📦 产品管理</h3>
          <p className="text-sm text-gray-600 mt-1">添加、编辑、删除产品</p>
        </Link>
        <Link href="/admin/orders" className="block p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
          <h3 className="text-lg font-semibold">📋 订单管理</h3>
          <p className="text-sm text-gray-600 mt-1">查看和处理订单</p>
        </Link>
        <Link href="/admin/inventory" className="block p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
          <h3 className="text-lg font-semibold">📊 库存管理</h3>
          <p className="text-sm text-gray-600 mt-1">管理产品库存数量</p>
        </Link>
      </div>
    </div>
  );
}
