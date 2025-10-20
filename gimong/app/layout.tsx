// app/layout.tsx
import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gimong",
  description: "La Trinidad Community of Believers Projectum",
  icons: {
    icon: "/gimong.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.className} flex min-h-screen flex-col`}>
          <main className="flex-1">{children}</main>
          <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
