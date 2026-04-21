import Link from "next/link";

const features = [
  {
    icon: "📸",
    title: "上传宠物照片",
    description: "上传你家小猫小狗的照片，AI 自动生成 3D 模型",
    href: "/upload",
  },
  {
    icon: "👗",
    title: "穿衣设计",
    description: "在 3D 画布上给宠物试穿各种衣服",
    href: "/design",
  },
  {
    icon: "🎨",
    title: "自定义设计",
    description: "自由选择配件、布料、颜色，打造专属造型",
    href: "/diy",
  },
  {
    icon: "🛒",
    title: "商城下单",
    description: "满意的设计可以一键下单，实物送到你家",
    href: "/shop",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          🐾 小猫小狗穿衣设计
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          上传你的宠物照片，AI 生成 3D 模型，给小猫小狗穿衣服、做设计，满意就下单！
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/upload"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            开始设计
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            浏览商城
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="block p-6 rounded-xl border hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">🤖 AI 驱动</h2>
        <p className="text-gray-600">
          所有产品推荐、设计建议、商品描述都由 AI 动态生成，内容实时更新，永不落伍。
          管理员只需上传图片，AI 自动完成产品描述、标签和评分。
        </p>
      </section>
    </div>
  );
}
