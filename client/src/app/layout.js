"use client";
import "./globals.css";
import NavbarComponent from "@/app/components/NavbarComponent";
import {AuthProvider, useAuth} from "@/app/context/GlobalContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <AuthProvider>
            <NavbarComponent />
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
