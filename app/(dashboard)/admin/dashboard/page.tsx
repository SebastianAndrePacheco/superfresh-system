import { createClient } from '@/lib/supabase/server'
import DashboardCharts from './dashboard-charts'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Estadísticas generales
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true)
  const { count: totalCustomers } = await supabase.from('customers').select('*', { count: 'exact', head: true }).eq('is_active', true)
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  
  // Total en inventario
  const { data: inventory } = await supabase.from('production_batches').select('quantity_available')
  const totalInventory = inventory?.reduce((sum, batch) => sum + batch.quantity_available, 0) || 0

  // Ventas últimos 7 días
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('order_date, total_amount')
    .gte('order_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('order_date')

  // Producción últimos 7 días
  const { data: recentProduction } = await supabase
    .from('production_batches')
    .select('production_date, quantity_produced, products(name)')
    .gte('production_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('production_date')

  // Productos más vendidos
  const { data: topProducts } = await supabase
    .from('order_items')
    .select('product_id, quantity, products(name)')
    .limit(100)

  const productSales = topProducts?.reduce((acc: any, item: any) => {
    const name = item.products?.name || 'Desconocido'
    acc[name] = (acc[name] || 0) + item.quantity
    return acc
  }, {})

  const topProductsData = Object.entries(productSales || {})
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Productos Activos</p>
          <p className="text-3xl font-bold text-white mt-2">{totalProducts}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Clientes</p>
          <p className="text-3xl font-bold text-white mt-2">{totalCustomers}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Pedidos Totales</p>
          <p className="text-3xl font-bold text-white mt-2">{totalOrders}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Inventario Total</p>
          <p className="text-3xl font-bold text-white mt-2">{totalInventory}</p>
        </div>
      </div>

      <DashboardCharts 
        salesData={recentOrders || []}
        productionData={recentProduction || []}
        topProducts={topProductsData}
      />
    </div>
  )
}
