import { createClient } from '@/lib/supabase/server'
import { Product, Order } from '@/types'
import OrderForm from './order-form'
import OrderList from './order-list'

export default async function VentasPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('order_date', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Registro de Ventas</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Nuevo Pedido</h2>
        <OrderForm products={products as Product[] || []} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Pedidos Recientes</h2>
        <OrderList orders={orders as Order[] || []} />
      </div>
    </div>
  )
}
