import type { Metadata } from "next";
import Link from 'next/link'
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LSA Text Summarizer",
  description: "Summarize your News!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-full bg-secondary fixed flex justify-center p-2">
          <div className="w-11/12 flex justify-end gap-2 text-white">
            <Link className="font-semibold" href="/">Home</Link>
            <Link className="font-semibold" href="/train">Train</Link>
            <Link className="font-semibold" href="/test">Testing</Link>
          </div>
        </div>
        {children}
        </body>
    </html>
  );
}
