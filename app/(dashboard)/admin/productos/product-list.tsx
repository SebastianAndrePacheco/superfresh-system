'use client'

import { Product } from '@/types'
import { toggleProductStatus } from '@/app/actions/products'

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Unidad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-800/50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">S/ {product.unit_price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.unit_measure}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.is_active ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                  {product.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleProductStatus(product.id, product.is_active)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  {product.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
