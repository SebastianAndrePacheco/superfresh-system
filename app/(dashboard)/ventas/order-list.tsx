'use client'

import { OrderWithItems } from '@/types'
import { useState } from 'react'

export default function OrderList({ orders }: { orders: OrderWithItems[] }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nº Pedido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {orders.map((order) => (
            <>
              <tr key={order.id} className="hover:bg-gray-800/50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-400">{order.order_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-white">{order.customers?.name || order.customer_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{new Date(order.order_date).toLocaleDateString('es-PE')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{order.order_items?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">S/ {order.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    order.status === 'completado' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                    order.status === 'pendiente' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' :
                    'bg-red-900/50 text-red-400 border border-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {expandedOrder === order.id ? 'Ocultar' : 'Ver detalle'}
                  </button>
                </td>
              </tr>
              {expandedOrder === order.id && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 bg-gray-800/50">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-300">Productos:</p>
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-400">
                          <span>{item.products?.name}</span>
                          <span>{item.quantity} × S/ {item.unit_price.toFixed(2)} = S/ {item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
