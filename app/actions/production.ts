'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBatch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const productionDate = formData.get('production_date') as string
  const productId = formData.get('product_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  // Obtener siguiente número consecutivo
  const { data: nextNumber, error: counterError } = await supabase
    .rpc('get_next_batch_number')
  
  if (counterError) throw counterError
  
  // Formato: LOTE-0001, LOTE-0002, etc.
  const batchCode = `LOTE-${nextNumber.toString().padStart(4, '0')}`

  const { error } = await supabase.from('production_batches').insert({
    product_id: productId,
    batch_code: batchCode,
    quantity_produced: quantity,
    quantity_available: quantity,
    production_date: productionDate,
    produced_by: user?.id,
  })

  if (error) throw error
  revalidatePath('/produccion')
}
