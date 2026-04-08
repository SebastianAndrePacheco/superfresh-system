import { createClient } from '@/lib/supabase/server'
import { Product, ProductionBatch } from '@/types'
import ProductionForm from './production-form'
import InventoryTable from './inventory-table'

export default async function ProduccionPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const { data: batches } = await supabase
    .from('production_batches')
    .select('*, products(*)')
    .order('production_date', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Control de Producción</h1>
      
      <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Registrar Lote de Producción</h2>
        <ProductionForm products={products as Product[] || []} />
      </div>

      <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Inventario Actual</h2>
        <InventoryTable batches={batches as ProductionBatch[] || []} />
      </div>
    </div>
  )
}
