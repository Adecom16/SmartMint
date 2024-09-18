import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Web3Modal } from "@/connection";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartMint",
  description: "No code token and nft deployment and interaction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <Web3Modal>
        <body>
          {children}
        </body>
      </Web3Modal>
    </html>
  );
}
