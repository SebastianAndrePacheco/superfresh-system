'use client'

import { Order } from '@/types'

export default function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nº Pedido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.order_number}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.customer_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.customer_phone || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(order.order_date).toLocaleDateString('es-PE')}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">S/ {order.total_amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'completado' ? 'bg-green-100 text-green-800' :
                  order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
