import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/upload", label: "上传照片" },
  { href: "/design", label: "穿衣设计" },
  { href: "/diy", label: "自定义设计" },
  { href: "/shop", label: "商城" },
  { href: "/cart", label: "购物车" },
  { href: "/admin", label: "后台管理" },
];

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🐾</span>
            <span>小猫小狗穿衣设计</span>
          </Link>
          <nav className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
