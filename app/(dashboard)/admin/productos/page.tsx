import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import ProductForm from './product-form'
import ProductList from './product-list'

export default async function ProductosPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Crear Producto</h2>
        <ProductForm />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Lista de Productos</h2>
        <ProductList products={products as Product[] || []} />
      </div>
    </div>
  )
}
