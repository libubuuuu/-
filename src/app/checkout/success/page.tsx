import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold mb-4">下单成功!</h1>
      <p className="text-gray-600 mb-8">
        您的订单已确认，我们会尽快处理并发送物流信息给您。
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/shop" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          继续购物
        </Link>
        <Link href="/" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
          返回首页
        </Link>
      </div>
    </div>
  );
}
