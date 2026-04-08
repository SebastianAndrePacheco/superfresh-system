import { createClient } from '@/lib/supabase/server'
import { Customer } from '@/types'
import { redirect } from 'next/navigation'
import CustomerForm from './customer-form'
import CustomerList from './customer-list'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') redirect('/produccion')

  const { data: customers } = await supabase.from('customers').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Clientes</h1>
      
      <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Registrar Cliente</h2>
        <CustomerForm />
      </div>

      <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Lista de Clientes</h2>
        <CustomerList customers={customers as Customer[] || []} />
      </div>
    </div>
  )
}
