import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { initAIProviders } from "@/lib/ai/config";

initAIProviders();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "小猫小狗穿衣设计 - Pet Clothing Design Studio",
  description: "上传你的小猫小狗照片，生成3D模型，给宠物穿衣服，自定义设计，一键下单购买",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-50 border-t py-6 text-center text-sm text-gray-500">
          © 2026 小猫小狗穿衣设计 - Pet Clothing Design Studio
        </footer>
      </body>
    </html>
  );
}
