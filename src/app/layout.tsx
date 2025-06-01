import type { Metadata } from "next";
import { Inter, Audiowide } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ModalProvider } from "@/contexts/ModalContext";

const inter = Inter({ subsets: ["latin"] });
const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Agent Rank - Discover the Best AI Agents",
  description: "Find and compare the best AI agents for your business needs. A curated directory of AI-powered tools and assistants.",
  openGraph: {
    title: "Agent Rank - Discover the Best AI Agents",
    description: "Find and compare the best AI agents for your business needs. A curated directory of AI-powered tools and assistants.",
    type: "website",
    locale: "en_US",
    siteName: "Agent Rank"
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Rank - Discover the Best AI Agents",
    description: "Find and compare the best AI agents for your business needs. A curated directory of AI-powered tools and assistants."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <ModalProvider>
          <div className="min-h-full flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
