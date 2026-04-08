export type Role = 'admin' | 'operario'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  created_at: string
}

export interface Product {
  id: string
  name: string
  unit_price: number
  unit_measure: string
  is_active: boolean
  created_at: string
}

export interface ProductionBatch {
  id: string
  product_id: string
  batch_code: string
  quantity_produced: number
  quantity_available: number
  production_date: string
  produced_by: string | null
  created_at: string
  products?: Product
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string | null
  order_date: string
  total_amount: number
  status: 'pendiente' | 'completado' | 'cancelado'
  created_by: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  batch_id: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  tax_id: string | null
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items?: (OrderItem & { products?: Product })[]
  customers?: Customer
}
