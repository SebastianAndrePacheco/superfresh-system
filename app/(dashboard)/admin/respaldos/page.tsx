import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BackupInterface from './backup-interface'

export default async function RespaldosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') redirect('/produccion')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Respaldo y Limpieza</h1>
      
      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-400 text-sm">
          <strong>⚠️ Advertencia:</strong> Esta acción descargará todos los pedidos y lotes de producción en Excel, 
          luego los eliminará de la base de datos. Úsalo para respaldos mensuales/semanales.
        </p>
      </div>

      <BackupInterface />
    </div>
  )
}
