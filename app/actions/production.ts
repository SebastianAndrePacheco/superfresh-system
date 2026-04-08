'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBatch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const productionDate = formData.get('production_date') as string
  const productId = formData.get('product_id') as string
  
  // Generar código de lote: LOTE-FECHA-001
  const { data: existingBatches } = await supabase
    .from('production_batches')
    .select('batch_code')
    .like('batch_code', `LOTE-${productionDate}%`)
    .order('batch_code', { ascending: false })
    .limit(1)

  let batchNumber = 1
  if (existingBatches && existingBatches.length > 0) {
    const lastCode = existingBatches[0].batch_code
    const lastNumber = parseInt(lastCode.split('-')[3])
    batchNumber = lastNumber + 1
  }

  const batchCode = `LOTE-${productionDate}-${batchNumber.toString().padStart(3, '0')}`
  const quantity = parseInt(formData.get('quantity') as string)

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
