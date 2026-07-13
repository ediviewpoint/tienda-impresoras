import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-guards'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Toaster from '@/components/admin/Toaster'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    redirect('/auth/login?callbackUrl=/admin')
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-8 overflow-auto pt-20 md:pt-8">
        {children}
      </div>
      <Toaster />
    </div>
  )
}
