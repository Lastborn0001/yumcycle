import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import CartInitializer from "@/components/CartInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yumcycle",
  description: "Delicious Food, Delivered with Purpose",
  icons: {
    icon: "/images/yumcycle.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff7300" />
        <link rel="apple-touch-icon" href="/images/yumcycle.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartInitializer />
        <ClientLayout>{children}</ClientLayout>
      </body>
      <script src="https://js.paystack.co/v1/inline.js" async></script>
    </html>
  );
}
