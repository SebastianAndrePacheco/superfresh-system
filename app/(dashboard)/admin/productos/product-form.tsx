'use client'

import { createProduct } from '@/app/actions/products'
import { useState } from 'react'

export default function ProductForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createProduct(formData)
    e.currentTarget.reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        name="name"
        placeholder="Nombre del producto"
        required
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      <input
        name="unit_price"
        type="number"
        step="0.01"
        placeholder="Precio unitario"
        required
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      <input
        name="unit_measure"
        placeholder="Unidad (kg, unidad, etc.)"
        required
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  )
}
