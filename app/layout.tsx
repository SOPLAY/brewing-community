import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/app/AuthProvider";
import ToastContainer from "@/components/ToastContainer";
import Header from "@/app/Header";
import Footer from "@/app/Footer";

const inter = Inter({ subsets: ["latin"] });
// const roboto = Roboto({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "브루잉 커뮤니티",
  description: "브루잉을 즐기는 사람들을 위한 커뮤니티 입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-w-[450px] `}>
        <AuthProvider>
          <Header />
          <main className="pt-[60px] main-container">{children}</main>
          <Footer />
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
