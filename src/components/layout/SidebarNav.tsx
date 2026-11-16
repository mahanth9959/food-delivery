import { NavLink } from 'react-router-dom'
import {
  ClipboardList,
  CookingPot,
  LayoutGrid,
  LifeBuoy,
  ReceiptText,
  Settings2,
  ShoppingBasket,
  Store,
  Tags,
  Users,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Order } from '../../types'
import { useAuth, useOrders } from '../../hooks/useApp'

const adminNav = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/orders', label: 'Orders', icon: ClipboardList, end: false, queue: true },
  { to: '/restaurants', label: 'Restaurants', icon: Store, end: false },
  { to: '/menu', label: 'Menu', icon: CookingPot, end: false },
  { to: '/customers', label: 'Customers', icon: Users, end: false },
]

/** A customer sees the shop, not the service desk. */
const customerNav = [
  { to: '/restaurants', label: 'Restaurants', icon: Store, end: false },
]

const adminWorkspace = [
  { to: '/cart', label: 'Basket', icon: ShoppingBasket },
  { to: '/checkout', label: 'Checkout', icon: ReceiptText },
  { to: '/order-history', label: 'Order history', icon: Tags },
]

const customerWorkspace = [
  { to: '/cart', label: 'Basket', icon: ShoppingBasket },
  { to: '/checkout', label: 'Checkout', icon: ReceiptText },
  { to: '/order-history', label: 'My orders', icon: Tags },
]

const isLive = (order: Order) =>
  order.status === 'placed' || order.status === 'preparing' || order.status === 'out_for_delivery'

/** One rail link: the board's own type, the current screen pressed into coral stock. */
function RailLink({
  to,
  label,
  icon: Icon,
  end,
  count,
  onNavigate,
}: {
  to: string
  label: string
  icon: typeof LayoutGrid
  end?: boolean
  count?: number
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex h-8 items-center gap-2.5 rounded-[6px] px-2 text-[13px] leading-4 transition-colors',
          isActive
            ? 'bg-brand font-medium text-brand-ink shadow-[var(--lit-edge)]'
            : 'text-board-muted hover:bg-board-2 hover:text-board-type',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={16} strokeWidth={1.6} className="shrink-0" />
          <span className="truncate">{label}</span>
          {count && count > 0 ? (
            <span
              className={cn(
                'num ml-auto rounded-[4px] px-1.5 py-0.5 text-[11px] leading-3 font-medium',
                isActive ? 'bg-brand-ink text-brand' : 'bg-brand text-brand-ink',
              )}
            >
              {count}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  )
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { orders } = useOrders()
  const { user } = useAuth()
  const admin = user?.access === 'admin'
  const liveCount = orders.filter(isLive).length
  const primaryNav = admin ? adminNav : customerNav
  const workspaceNav = admin ? adminWorkspace : customerWorkspace

  return (
    <nav aria-label="Main" className="flex flex-1 flex-col">
      <ul className="space-y-0.5">
        {primaryNav.map((item) => (
          <li key={item.to}>
            <RailLink
              to={item.to}
              label={item.label}
              icon={item.icon}
              end={item.end}
              count={'queue' in item && item.queue ? liveCount : undefined}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>

      <p className="mt-6 mb-2 px-2 text-[11px] leading-4 font-medium text-board-faint">
        {admin ? 'Service desk' : 'Your order'}
      </p>
      <ul className="space-y-0.5">
        {workspaceNav.map((item) => (
          <li key={item.to}>
            <RailLink to={item.to} label={item.label} icon={item.icon} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <ul className="space-y-0.5">
          <li>
            <RailLink to="/profile" label="Profile & settings" icon={Settings2} onNavigate={onNavigate} />
          </li>
          <li>
            <a
              href="https://dummyjson.com/docs/recipes"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 items-center gap-2.5 rounded-[6px] px-2 text-[13px] leading-4 text-board-muted transition-colors hover:bg-board-2 hover:text-board-type"
            >
              <LifeBuoy size={16} strokeWidth={1.6} />
              Catalogue source
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
