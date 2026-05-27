import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalBackground from "./components/GlobalBackground";
import { AuthProvider } from "./lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Om Awasthi | Portfolio",
  description:
    "BCA Student, Web Developer, Projects, Skills and Notes Library",

  keywords: [
    "Om Awasthi",
    "Portfolio",
    "Web Developer",
    "BCA Student",
    "Next.js Portfolio",
    "Programming Notes",
    "Developer Portfolio",
  ],

  authors: [{ name: "Om Awasthi" }],

  creator: "Om Awasthi",

  verification: {
    google: "AzyvUkyI7pfDd_AIyQ5bdSh8ZfhtgdpUANFt-jOOV6Q",
  },

  openGraph: {
    title: "Om Awasthi | Portfolio",
    description:
      "BCA Student, Web Developer, Projects, Skills and Notes Library",
    url: "https://om-portfolio-tau-inky.vercel.app",
    siteName: "Om Awasthi Portfolio",
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <AuthProvider>
          <GlobalBackground />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}