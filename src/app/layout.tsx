// src/app/layout.tsx
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen flex flex-col bg-white text-gray-800">
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
