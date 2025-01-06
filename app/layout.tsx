
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import Header from "@/components/header/Header";
import { useState } from "react";
import { AuthProvider } from "@/contexts/authContext";
import { AssetProvider } from "@/contexts/assetContext";
import Navbar from "@/components/header/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AssetProvider>
              <ProtectedRoute>
                <div className="bg-[#e6f4ed] text-[#007f40] min-h-screen ">
                  <Header />
                  <Navbar />
                  <main className="">
                    {children}
                  </main>
                  <footer >
                  </footer>
                </div>
              </ProtectedRoute>
            </AssetProvider>
          </AuthProvider>
        </QueryClientProvider>

      </body>
    </html>
  );
}
