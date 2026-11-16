import { Navigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth, useOrders } from '../hooks/useApp'

/**
 * An order is readable by the account that placed it, and by the console.
 * A customer opening someone else's order is sent to their own history rather
 * than shown a stranger's receipt.
 */
export function OrderAccessRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { getOrder } = useOrders()
  const { orderId } = useParams()

  if (!user) return <Navigate to="/login" replace />
  if (user.access === 'admin') return <>{children}</>

  const order = orderId ? getOrder(orderId) : undefined
  if (order && order.placedBy === user.id) return <>{children}</>

  return <Navigate to="/order-history" replace />
}
