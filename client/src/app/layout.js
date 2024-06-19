"use client";
import "./globals.css";
import NavbarComponent from "@/app/components/NavbarComponent";
import { AuthProvider, useAuth } from "@/app/context/GlobalContext";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { io } from "socket.io-client";

let queryClient = new QueryClient();

export default function RootLayout({ children }) {
  useEffect(() => {
    let socket = io(process.env.SERVER_URL);
    socket.on("notifications",(data)=>{
      console.log(data);
    })
    socket.on("post_added", (data) => {
      console.log(data);
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
