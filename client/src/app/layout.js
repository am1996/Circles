"use client";
import "./globals.css";
import NavbarComponent from "@/app/components/NavbarComponent";
import { AuthProvider, useAuth } from "@/app/context/GlobalContext";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

let queryClient = new QueryClient();

export default function RootLayout({ children }) {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/helloworld")
    socket.addEventListener("open",(data)=>{
    });
  }, []);
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavbarComponent />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
