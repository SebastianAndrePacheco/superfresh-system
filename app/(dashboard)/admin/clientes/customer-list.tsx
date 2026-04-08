'use client'

import { Customer } from '@/types'
import { toggleCustomerStatus } from '@/app/actions/customers'

export default function CustomerList({ customers }: { customers: Customer[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Teléfono</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">RUC/DNI</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-800/50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-white">{customer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{customer.phone || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{customer.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{customer.tax_id || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${customer.is_active ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                  {customer.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => toggleCustomerStatus(customer.id, customer.is_active)} className="text-sm text-blue-400 hover:text-blue-300">
                  {customer.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
