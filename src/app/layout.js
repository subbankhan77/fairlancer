"use client";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import BottomToTop from "@/components/button/BottomToTop";
import SearchModal1 from "@/components/modal/SearchModal1";
import { usePathname } from "next/navigation";
import toggleStore from "@/store/toggleStore";
import "react-tooltip/dist/react-tooltip.css";
import NavSidebar from "@/components/sidebar/NavSidebar";
import { ReduxProvider } from './providers';
if (typeof window !== "undefined") {
  import("bootstrap");
}

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export default function RootLayout({ children }) {
  const isListingActive = toggleStore((state) => state.isListingActive);
  const path = usePathname();

  // wow js
  useEffect(() => {
    const { WOW } = require("wowjs");
    const wow = new WOW({
      live: false,
    });
    wow.init();
  }, [path]);

  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <SessionProvider>
          <SearchModal1 />
          <ReduxProvider>
          {children}
          </ReduxProvider>

          {/* bottom to top */}
          <BottomToTop />

          {/* sidebar mobile navigation */}
          <NavSidebar />

          {/* toast */}
          <Toaster 
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              removeDelay: 1000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: "Inter, sans-serif"
              },
          
              // Default options for specific types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
