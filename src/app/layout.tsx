"use client";

import { DM_Sans } from "next/font/google";
import "./global.scss";

import AppWrappers from "@/app/AppWrapper";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";
import Script from "next/script";

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Push the initialization code into OneSignalDeferred array.
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APPID,
      });
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        ></Script>
      </head>
      <body id={"root"} className={dmSans.className}>
        <AppWrappers>{children}</AppWrappers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GAID || ""} />
      </body>
    </html>
  );
}
