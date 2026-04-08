import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types'
import { redirect } from 'next/navigation'
import UserList from './user-list'

export default async function UsuariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()

  // Solo admin puede acceder
  if (profile?.role !== 'admin') {
    redirect('/produccion')
  }

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
      
      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-400 text-sm">
          <strong>Nota:</strong> Para crear nuevos usuarios, ve a Supabase Dashboard → Authentication → Users → Add user.
          Luego crea el perfil en la tabla <code>profiles</code> con el mismo ID.
        </p>
      </div>

      <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Usuarios del Sistema</h2>
        <UserList users={users as Profile[] || []} />
      </div>
    </div>
  )
}
