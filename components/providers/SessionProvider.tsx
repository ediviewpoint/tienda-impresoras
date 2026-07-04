'use client'

import { useEffect } from 'react'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useStore } from '@/lib/store/useStore'

export function SessionProvider({ children, session }: { children: React.ReactNode; session: Session | null }) {
  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return (
    <NextAuthSessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </NextAuthSessionProvider>
  )
}
