import "./globals.css"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata = {
  title: "Nola God Level",
  description: "Dashboard de performance e vendas",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={cn("font-sans antialiased")}>{children}</body>
    </html>
  )
}
