'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBackupData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('No tienes permisos')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      customers(name, phone, email),
      order_items(*, products(name))
    `)
    .order('order_date', { ascending: false })

  const { data: batches } = await supabase
    .from('production_batches')
    .select('*, products(name)')
    .order('production_date', { ascending: false })

  return {
    orders: orders || [],
    batches: batches || []
  }
}

export async function clearSecondaryData(resetCounter: boolean = false) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('No tienes permisos')
  }

  // Usar RPC function para bypass RLS
  const { error } = await supabase.rpc('clear_backup_data', { 
    reset_counter: resetCounter 
  })

  if (error) throw error

  revalidatePath('/admin/respaldos')
  revalidatePath('/ventas')
  revalidatePath('/produccion')
  revalidatePath('/admin/dashboard')

  return { success: true }
}
