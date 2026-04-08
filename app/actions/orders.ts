'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface OrderItemInput {
  product_id: string
  quantity: number
}

export async function createOrder(customerId: string, items: OrderItemInput[], orderDate: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
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
  
  // Calcular total
  let totalAmount = 0
  const orderItemsData = []

  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('unit_price')
      .eq('id', item.product_id)
      .single()

    if (!product) throw new Error('Producto no encontrado')

    const subtotal = product.unit_price * item.quantity
    totalAmount += subtotal

    // Asignar lote FIFO
    const { data: batchId, error: fifoError } = await supabase
      .rpc('assign_fifo_batch', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      })

    if (fifoError) {
      throw new Error(`Sin stock suficiente para completar el pedido`)
    }

    orderItemsData.push({
      product_id: item.product_id,
      batch_id: batchId,
      quantity: item.quantity,
      unit_price: product.unit_price,
      subtotal: subtotal,
    })
  }

  // Crear la orden
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNum,
      customer_id: customerId,
      order_date: orderDate,
      total_amount: totalAmount,
      status: 'completado',
      created_by: user?.id,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Insertar items
  const itemsWithOrderId = orderItemsData.map(item => ({
    ...item,
    order_id: order.id,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId)

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    throw itemsError
  }

  revalidatePath('/ventas')
  return order
}
