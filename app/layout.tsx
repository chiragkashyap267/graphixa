import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import LenisProvider from "@/components/LennisProvider";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import PageTransition from "@/components/PageTransition";
import Script from "next/script";


export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "../public/fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "../public/fonts/Satoshi-Bold.woff2", weight: "700" },
    { path: "../public/fonts/Satoshi-Black.woff2", weight: "900" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});
export const metadata = {
  title: "GraphiXA",
   icons: {
    icon: "/favicon.png",
  },
  description: "Buy premium mockups & digital assets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
      ${inter.variable}
      ${satoshi.variable}
      bg-[#020617]
      text-slate-100
      antialiased
    `}
      >

        <LenisProvider>
          <AuthProvider>
            <CartProvider>
              {/* 🌐 NAVBAR */}

              <Navbar />

              {/* 🌊 PAGE WRAPPER */}
              <main
                className="
    relative
    max-w-7xl mx-auto
    px-6
    pt-20 pb-28
    space-y-32
  "
              >
                <PageTransition>{children}</PageTransition>
                <Footer />
              </main>
            </CartProvider>
          </AuthProvider>
        </LenisProvider>
     
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
