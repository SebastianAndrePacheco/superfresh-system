'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const orderDate = formData.get('order_date') as string
  
  // Generar número de pedido: PED-2025-001
  const year = new Date(orderDate).getFullYear()
  const { data: existingOrders } = await supabase
    .from('orders')
    .select('order_number')
    .like('order_number', `PED-${year}%`)
    .order('order_number', { ascending: false })
    .limit(1)

  let orderNumber = 1
  if (existingOrders && existingOrders.length > 0) {
    const lastNumber = parseInt(existingOrders[0].order_number.split('-')[2])
    orderNumber = lastNumber + 1
  }

  const orderNum = `PED-${year}-${orderNumber.toString().padStart(3, '0')}`
  
  const customerName = formData.get('customer_name') as string
  const customerPhone = formData.get('customer_phone') as string
  const productId = formData.get('product_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  // Obtener precio del producto
  const { data: product } = await supabase
    .from('products')
    .select('unit_price')
    .eq('id', productId)
    .single()

  if (!product) throw new Error('Producto no encontrado')

  const subtotal = product.unit_price * quantity
  
  // Crear la orden
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNum,
      customer_name: customerName,
      customer_phone: customerPhone,
      order_date: orderDate,
      total_amount: subtotal,
      status: 'completado',
      created_by: user?.id,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Asignar lote FIFO usando la función SQL
  const { data: batchId, error: fifoError } = await supabase
    .rpc('assign_fifo_batch', {
      p_product_id: productId,
      p_quantity: quantity,
    })

  if (fifoError) {
    // Rollback: eliminar la orden si falla el FIFO
    await supabase.from('orders').delete().eq('id', order.id)
    throw new Error('Sin stock suficiente para completar el pedido')
  }

  // Crear el item del pedido
  const { error: itemError } = await supabase
    .from('order_items')
    .insert({
      order_id: order.id,
      product_id: productId,
      batch_id: batchId,
      quantity: quantity,
      unit_price: product.unit_price,
      subtotal: subtotal,
    })

  if (itemError) throw itemError

  revalidatePath('/ventas')
}
