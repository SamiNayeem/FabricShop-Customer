// src/app/layout.tsx
import React from 'react';
import { AuthProvider } from '@/app/context/auth-context';
import Navbar from '../components/navbar/navbar';


import { Metadata } from 'next';
import Footer from '@/components/footer/footer';
import './globals.css';

export const metadata: Metadata = {
  title: "FabricShop Admin",
  description: "An E-Commerce website built with Next.js and Tailwind CSS",
};

function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;
