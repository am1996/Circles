"use client";
import "./globals.css";
import {AuthProvider, useAuth} from "@/app/context/GlobalContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
