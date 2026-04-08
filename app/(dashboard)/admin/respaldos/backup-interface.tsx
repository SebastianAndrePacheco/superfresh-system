'use client'

import { getBackupData, clearSecondaryData } from '@/app/actions/backup'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

export default function BackupInterface() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'initial' | 'downloaded' | 'cleared'>('initial')
  const [resetCounter, setResetCounter] = useState(false)
  const router = useRouter()

  const handleDownloadBackup = async () => {
    setLoading(true)
    try {
      const data = await getBackupData()
      
      const ordersSheet = data.orders.map((order: any) => ({
        'Nº Pedido': order.order_number,
        'Cliente': order.customers?.name || 'N/A',
        'Teléfono': order.customers?.phone || '',
        'Email': order.customers?.email || '',
        'Fecha': new Date(order.order_date).toLocaleDateString('es-PE'),
        'Total': order.total_amount,
        'Estado': order.status,
        'Productos': order.order_items?.map((item: any) => 
          `${item.products?.name} (${item.quantity}x)`
        ).join(', ')
      }))

      const itemsSheet = data.orders.flatMap((order: any) => 
        order.order_items?.map((item: any) => ({
          'Nº Pedido': order.order_number,
          'Cliente': order.customers?.name || 'N/A',
          'Fecha Pedido': new Date(order.order_date).toLocaleDateString('es-PE'),
          'Producto': item.products?.name,
          'Cantidad': item.quantity,
          'Precio Unitario': item.unit_price,
          'Subtotal': item.subtotal
        })) || []
      )

      const batchesSheet = data.batches.map((batch: any) => ({
        'Código Lote': batch.batch_code,
        'Producto': batch.products?.name,
        'Fecha Producción': new Date(batch.production_date).toLocaleDateString('es-PE'),
        'Cantidad Producida': batch.quantity_produced,
        'Cantidad Disponible': batch.quantity_available,
        'Cantidad Vendida': batch.quantity_produced - batch.quantity_available
      }))

      const wb = XLSX.utils.book_new()
      
      const wsOrders = XLSX.utils.json_to_sheet(ordersSheet)
      const wsItems = XLSX.utils.json_to_sheet(itemsSheet)
      const wsBatches = XLSX.utils.json_to_sheet(batchesSheet)
      
      XLSX.utils.book_append_sheet(wb, wsOrders, 'Pedidos')
      XLSX.utils.book_append_sheet(wb, wsItems, 'Items Detallados')
      XLSX.utils.book_append_sheet(wb, wsBatches, 'Producción')

      const timestamp = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `Respaldo_Superfresh_${timestamp}.xlsx`)
      
      setStep('downloaded')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm('¿Estás seguro? Esto eliminará TODOS los pedidos y lotes de producción. Esta acción NO se puede deshacer.')) {
      return
    }

    if (!confirm('CONFIRMACIÓN FINAL: ¿Ya descargaste el respaldo en Excel?')) {
      return
    }

    setLoading(true)
    try {
      await clearSecondaryData(resetCounter)
      setStep('cleared')
      
      // Forzar recarga después de 1 segundo
      setTimeout(() => {
        router.refresh()
        window.location.href = '/admin/respaldos'
      }, 1000)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-800">
      <h2 className="text-lg font-semibold mb-6 text-white">Proceso de Respaldo</h2>
      
      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${
          step === 'initial' 
            ? 'bg-blue-900/20 border-blue-800' 
            : 'bg-green-900/20 border-green-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">
                {step === 'initial' ? '1. Descargar Respaldo' : '✓ Respaldo Descargado'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Descarga un archivo Excel con todos los pedidos y lotes de producción
              </p>
            </div>
            {step === 'initial' && (
              <button
                onClick={handleDownloadBackup}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition font-medium"
              >
                {loading ? 'Descargando...' : 'Descargar Excel'}
              </button>
            )}
          </div>
        </div>

        {step === 'downloaded' && (
          <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={resetCounter}
                onChange={(e) => setResetCounter(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="text-white font-medium">Resetear numeración de lotes a LOTE-0001</span>
                <p className="text-sm text-gray-400">
                  Si no marcas esto, la numeración continuará (ej: si el último fue LOTE-0025, el siguiente será LOTE-0026)
                </p>
              </div>
            </label>
          </div>
        )}

        <div className={`p-4 rounded-lg border ${
          step === 'downloaded' 
            ? 'bg-red-900/20 border-red-800' 
            : step === 'cleared'
            ? 'bg-green-900/20 border-green-800'
            : 'bg-gray-800/50 border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">
                {step === 'cleared' ? '✓ Base de Datos Limpiada' : '2. Limpiar Base de Datos'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {step === 'cleared' 
                  ? 'Todos los datos secundarios fueron eliminados. Recargando...'
                  : 'Elimina todos los pedidos y lotes (mantiene productos, clientes y usuarios)'
                }
              </p>
            </div>
            {step === 'downloaded' && (
              <button
                onClick={handleClearData}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition font-medium"
              >
                {loading ? 'Limpiando...' : 'Limpiar Todo'}
              </button>
            )}
          </div>
        </div>

        {step === 'cleared' && (
          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-green-400 text-center font-medium">
              ✓ Proceso completado. Recargando página...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
