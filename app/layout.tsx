import type { Metadata } from 'next'
import './globals.css'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from '@/components/providers/SessionProvider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { auth } from '@/auth'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://printmax.bo'),
  title: {
    default: 'PrintMax — Tu Tienda de Impresoras',
    template: '%s | PrintMax',
  },
  description: 'Las mejores impresoras, tóner, tinta y accesorios en Bolivia. Envío gratis en pedidos +Bs. 500. Garantía oficial.',
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    siteName: 'PrintMax',
    title: 'PrintMax — Tu Tienda de Impresoras',
    description: 'Las mejores impresoras, tóner, tinta y accesorios en Bolivia. Envío gratis en pedidos +Bs. 500. Garantía oficial.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrintMax — Tu Tienda de Impresoras',
    description: 'Las mejores impresoras, tóner, tinta y accesorios en Bolivia. Envío gratis en pedidos +Bs. 500.',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col">
        <NuqsAdapter>
          <SessionProvider session={session}>
            <AnnouncementBar />
            <Header />
            <Nav />
            <main className="flex-1 pb-16">{children}</main>
            <Footer />
          </SessionProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
