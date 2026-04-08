'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createUserProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Verificar que el usuario actual sea admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  if (profile?.role !== 'admin') {
    throw new Error('No tienes permisos para crear usuarios')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as string

  // NOTA: En producción, esto requiere usar supabase.auth.admin.createUser()
  // que solo funciona con service_role key desde el servidor
  // Por ahora, los usuarios se crean manualmente en Supabase Dashboard
  
  // Placeholder: En producción implementar con Admin API
  throw new Error('Crear usuarios requiere configuración de Admin API. Por ahora, créalos en Supabase Dashboard → Authentication → Users')
}

export async function toggleUserStatus(userId: string, currentRole: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  if (profile?.role !== 'admin') {
    throw new Error('No tienes permisos')
  }

  // Cambiar rol entre admin y operario
  const newRole = currentRole === 'admin' ? 'operario' : 'admin'
  
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) throw error
  revalidatePath('/admin/usuarios')
}
