'use client'

import { createOrder } from '@/app/actions/orders'
import { Product, Customer } from '@/types'
import { useState } from 'react'

interface OrderItem {
  product_id: string
  quantity: number
  product_name: string
  unit_price: number
}

export default function OrderForm({ products, customers }: { products: Product[], customers: Customer[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<OrderItem[]>([])
  const [currentProduct, setCurrentProduct] = useState('')
  const [currentQuantity, setCurrentQuantity] = useState(1)

  const addItem = () => {
    if (!currentProduct) return
    
    const product = products.find(p => p.id === currentProduct)
    if (!product) return

    const existingIndex = items.findIndex(i => i.product_id === currentProduct)
    if (existingIndex >= 0) {
      const newItems = [...items]
      newItems[existingIndex].quantity += currentQuantity
      setItems(newItems)
    } else {
      setItems([...items, {
        product_id: product.id,
        quantity: currentQuantity,
        product_name: product.name,
        unit_price: product.unit_price,
      }])
    }
    
    setCurrentProduct('')
    setCurrentQuantity(1)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customerId || items.length === 0) {
      setError('Selecciona un cliente y agrega al menos un producto')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await createOrder(customerId, items, orderDate)
      setCustomerId('')
      setItems([])
      setOrderDate(new Date().toISOString().split('T')[0])
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Selección de cliente y fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} {customer.phone ? `- ${customer.phone}` : ''}
            </option>
          ))}
        </select>
        
        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          required
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Agregar productos */}
      <div className="border border-gray-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">Agregar Productos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={currentProduct}
            onChange={(e) => setCurrentProduct(e.target.value)}
            className="md:col-span-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - S/ {product.unit_price.toFixed(2)}/{product.unit_measure}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            min="1"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="button"
            onClick={addItem}
            disabled={!currentProduct}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition font-medium"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de items */}
      {items.length > 0 && (
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Precio Unit.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subtotal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-white">{item.product_name}</td>
                  <td className="px-4 py-3 text-gray-300">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-300">S/ {item.unit_price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-white font-semibold">S/ {(item.quantity * item.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-800">
                <td colSpan={3} className="px-4 py-3 text-right text-white font-semibold">TOTAL:</td>
                <td className="px-4 py-3 text-white font-bold text-lg">S/ {total.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || items.length === 0 || !customerId}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition font-medium text-lg"
      >
        {loading ? 'Creando Pedido...' : `Crear Pedido - S/ ${total.toFixed(2)}`}
      </button>
    </div>
  )
}
