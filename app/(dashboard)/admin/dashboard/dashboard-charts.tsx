'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function DashboardCharts({ 
  salesData, 
  productionData,
  topProducts 
}: { 
  salesData: any[]
  productionData: any[]
  topProducts: any[]
}) {
  
  // Agrupar ventas por día
  const salesByDay = salesData.reduce((acc: any, order) => {
    const date = new Date(order.order_date).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })
    acc[date] = (acc[date] || 0) + parseFloat(order.total_amount)
    return acc
  }, {})

  const salesChartData = Object.entries(salesByDay).map(([date, amount]) => ({
    fecha: date,
    ventas: amount
  }))

  // Agrupar producción por día
  const productionByDay = productionData.reduce((acc: any, batch) => {
    const date = new Date(batch.production_date).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })
    acc[date] = (acc[date] || 0) + batch.quantity_produced
    return acc
  }, {})

  const productionChartData = Object.entries(productionByDay).map(([date, quantity]) => ({
    fecha: date,
    produccion: quantity
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ventas últimos 7 días */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ventas - Últimos 7 días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="fecha" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Line type="monotone" dataKey="ventas" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Producción últimos 7 días */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Producción - Últimos 7 días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productionChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="fecha" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Line type="monotone" dataKey="produccion" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top productos */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Productos Más Vendidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Bar dataKey="quantity" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
