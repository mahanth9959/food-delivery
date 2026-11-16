import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useApp'

/**
 * The console's management screens belong to admin accounts. A customer reaches
 * the catalogue, the basket, checkout and their own orders, and is sent back to
 * the shop floor rather than shown a screen it cannot use.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.access !== 'admin') return <Navigate to="/restaurants" replace />
  return <>{children}</>
}
