import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "../components/starknet-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amneszia",
  description: "Will you find those pairs ?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fpg2smx.css" />
      </head>
      <body className="tk-coordinates">
        <StarknetProvider>
          {children}
        </StarknetProvider>
      </body>
    </html>
  );
}
