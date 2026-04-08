'use client'

import { createBatch } from '@/app/actions/production'
import { Product } from '@/types'
import { useState } from 'react'

export default function ProductionForm({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createBatch(formData)
    e.currentTarget.reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        name="product_id"
        required
        className="px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Seleccionar producto</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} ({product.unit_measure})
          </option>
        ))}
      </select>
      
      <input
        name="quantity"
        type="number"
        min="1"
        placeholder="Cantidad producida"
        required
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      
      <input
        name="production_date"
        type="date"
        required
        defaultValue={new Date().toISOString().split('T')[0]}
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrar Lote'}
      </button>
    </form>
  )
}
