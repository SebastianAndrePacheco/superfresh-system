'use client'

import { createOrder } from '@/app/actions/orders'
import { Product } from '@/types'
import { useState } from 'react'

export default function OrderForm({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.currentTarget)
      await createOrder(formData)
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="customer_name"
          placeholder="Nombre del cliente"
          required
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        
        <input
          name="customer_phone"
          placeholder="Teléfono (opcional)"
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        
        <input
          name="order_date"
          type="date"
          required
          defaultValue={new Date().toISOString().split('T')[0]}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        
        <select
          name="product_id"
          required
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Seleccionar producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - S/ {product.unit_price.toFixed(2)}/{product.unit_measure}
            </option>
          ))}
        </select>
        
        <input
          name="quantity"
          type="number"
          min="1"
          placeholder="Cantidad"
          required
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Pedido'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
