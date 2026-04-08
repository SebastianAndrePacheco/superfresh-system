'use client'

import { Profile } from '@/types'
import { toggleUserStatus } from '@/app/actions/users'

export default function UserList({ users }: { users: Profile[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Creado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-800/50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-white">{user.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-900/50 text-purple-400 border border-purple-800' 
                    : 'bg-blue-900/50 text-blue-400 border border-blue-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {new Date(user.created_at).toLocaleDateString('es-PE')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleUserStatus(user.id, user.role)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Cambiar a {user.role === 'admin' ? 'Operario' : 'Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
