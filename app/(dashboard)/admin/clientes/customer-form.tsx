'use client'

import { createCustomer } from '@/app/actions/customers'
import { useState } from 'react'

export default function CustomerForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createCustomer(formData)
    e.currentTarget.reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" placeholder="Nombre completo *" required
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input name="phone" placeholder="Teléfono"
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input name="email" type="email" placeholder="Email"
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input name="tax_id" placeholder="RUC / DNI"
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input name="address" placeholder="Dirección" className="md:col-span-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <textarea name="notes" placeholder="Notas adicionales" rows={2} className="md:col-span-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" disabled={loading} className="md:col-span-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition font-medium">
        {loading ? 'Registrando...' : 'Registrar Cliente'}
      </button>
    </form>
  )
}
