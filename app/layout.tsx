import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "YouTube Transcript Storage",
  description: "Fetch, store, and manage YouTube transcripts with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
