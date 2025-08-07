// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Sparkles } from 'lucide-react'

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "ChitraKar",
//   description: "#1 Project By Akash More In 52 Projects Challenge",
//   icons: {
//     icon: '/favicon.svg',
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         suppressHydrationWarning={true}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Inter - The best professional font for modern web applications
// Used by: GitHub, Netflix, Stripe, Figma, and thousands of professional apps
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

// JetBrains Mono - For any code or monospace elements
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChitraKar",
  description: "#1 Project By Akash More In 52 Projects Challenge",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
        style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}