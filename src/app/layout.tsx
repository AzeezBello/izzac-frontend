// src/app/layout.tsx
import '../styles/globals.css'; // Ensure this path points to `src/styles/globals.css`
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ReactNode } from 'react';



const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen flex flex-col bg-white text-gray-800">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
