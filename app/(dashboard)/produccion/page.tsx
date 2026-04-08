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
      <h1 className="text-2xl font-bold">Control de Producción</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Registrar Lote de Producción</h2>
        <ProductionForm products={products as Product[] || []} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Inventario Actual</h2>
        <InventoryTable batches={batches as ProductionBatch[] || []} />
      </div>
    </div>
  )
}
