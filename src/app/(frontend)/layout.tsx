import type { Metadata } from 'next'

import { CartDrawer } from '@/components/shop/CartDrawer'
import { CartProvider } from '@/components/shop/CartProvider'
import { Footer } from '@/components/shared/Footer'
import { Header } from '@/components/shared/Header'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ),
  title: {
    default: "Let's Fight Glio Foundation",
    template: "%s | Let's Fight Glio",
  },
  description:
    'A nonprofit fighting glioblastoma brain cancer through research funding, family support, and community awareness.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
  },
  openGraph: {
    type: 'website',
    siteName: "Let's Fight Glio Foundation",
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-background text-foreground"
      >
        <CartProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
