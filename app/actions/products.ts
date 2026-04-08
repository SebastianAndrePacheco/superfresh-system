'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('products').insert({
    name: formData.get('name') as string,
    unit_price: parseFloat(formData.get('unit_price') as string),
    unit_measure: formData.get('unit_measure') as string,
  })

  if (error) throw error
  revalidatePath('/admin/productos')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('products').update({
    name: formData.get('name') as string,
    unit_price: parseFloat(formData.get('unit_price') as string),
    unit_measure: formData.get('unit_measure') as string,
  }).eq('id', id)

  if (error) throw error
  revalidatePath('/admin/productos')
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('products').update({
    is_active: !isActive
  }).eq('id', id)

  if (error) throw error
  revalidatePath('/admin/productos')
}
