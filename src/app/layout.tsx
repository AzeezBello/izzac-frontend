import "../styles/globals.css";
import localFont from "next/font/local";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
export { metadata } from "./metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
