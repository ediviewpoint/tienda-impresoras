import type { Metadata } from 'next'
import './globals.css'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from '@/components/providers/SessionProvider'
import { auth } from '@/auth'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'PrintMax — Tu Tienda de Impresoras',
  description: 'Las mejores impresoras, tóner, tinta y accesorios. Envío gratis en pedidos +$800 MXN. Garantía oficial.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col">
        <SessionProvider session={session}>
          <AnnouncementBar />
          <Header />
          <Nav />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
