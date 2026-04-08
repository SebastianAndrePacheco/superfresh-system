'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('customers').insert({
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    tax_id: formData.get('tax_id') as string,
    notes: formData.get('notes') as string,
  })

  if (error) throw error
  revalidatePath('/admin/clientes')
}

export async function toggleCustomerStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('customers').update({
    is_active: !isActive
  }).eq('id', id)

  if (error) throw error
  revalidatePath('/admin/clientes')
}
