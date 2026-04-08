'use client'

import { ProductionBatch } from '@/types'

export default function InventoryTable({ batches }: { batches: ProductionBatch[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código Lote</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Producción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{batch.batch_code}</td>
              <td className="px-6 py-4 whitespace-nowrap">{batch.products?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(batch.production_date).toLocaleDateString('es-PE')}</td>
              <td className="px-6 py-4 whitespace-nowrap">{batch.quantity_produced}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">{batch.quantity_available}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${batch.quantity_available > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {batch.quantity_available > 0 ? 'Disponible' : 'Agotado'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
