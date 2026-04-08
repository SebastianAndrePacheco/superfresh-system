'use client'

import { ProductionBatch } from '@/types'

export default function InventoryTable({ batches }: { batches: ProductionBatch[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Código Lote</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha Producción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Disponible</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {batches.map((batch) => (
            <tr key={batch.id} className="hover:bg-gray-800/50 transition">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-400">{batch.batch_code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-white">{batch.products?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{new Date(batch.production_date).toLocaleDateString('es-PE')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{batch.quantity_produced}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">{batch.quantity_available}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${batch.quantity_available > 0 ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
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
