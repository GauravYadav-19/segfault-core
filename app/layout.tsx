import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Load our custom fonts
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space" 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono" 
});

export const metadata: Metadata = {
  title: "SegFault | Competitive Coding Arena",
  description: "Track your rank. Destroy your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* We apply the dark background, white text, and selection color here now */}
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-zinc-950 text-white antialiased selection:bg-green-500/30`}>
        {children}
      </body>
    </html>
  );
}