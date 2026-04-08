import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white">Superfresh</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/admin/productos" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition">
                  Productos
                </a>
                <a href="/produccion" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition">
                  Producción
                </a>
                <a href="/ventas" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition">
                  Ventas
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">{profile?.full_name}</span>
              <span className="text-xs text-gray-500 uppercase bg-gray-800 px-2 py-1 rounded">{profile?.role}</span>
              <form action={handleSignOut}>
                <button type="submit" className="text-sm text-red-400 hover:text-red-300 transition">
                  Salir
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
