import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBasket,
  Store,
  UserRound,
  X,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth, useCart, useCatalog } from '../../hooks/useApp'
import { initials } from '../../lib/format'
import { cn } from '../../lib/cn'
import { TiffinMark } from '../brand/TiffinMark'
import { SidebarNav } from './SidebarNav'

/** The wordmark on the board: the tiffin itself, pressed in coral, for the dark rail. */
function BoardWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <TiffinMark size={compact ? 24 : 26} className="text-brand" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[-0.015em]">dabba</span>
        {!compact ? (
          <span className="mt-1 text-[11px] leading-3 text-board-faint">Dinner service</span>
        ) : null}
      </span>
    </span>
  )
}

function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  if (!user) return null

  return (
    <div ref={wrap} className={cn('relative', compact && 'w-full')}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2.5 rounded-[6px] text-left transition-colors hover:bg-board-2',
          compact ? 'w-full p-2' : 'w-full p-1.5',
        )}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand-deep">
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-4 font-medium text-board-type">
            {user.name}
          </span>
          <span className="block truncate text-[12px] leading-4 text-board-faint">{user.role}</span>
        </span>
        <ChevronDown size={14} strokeWidth={1.6} className="shrink-0 text-board-faint" />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className="absolute bottom-full left-0 z-40 mb-2 w-full min-w-[228px] overflow-hidden rounded-[8px] bg-surface shadow-[var(--shadow-pop)] ring-1 ring-line"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-[13px] font-medium">{user.name}</p>
            <p className="truncate text-[13px] text-faint">{user.email}</p>
          </div>
          <div className="h-px bg-rule" />
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-9 items-center gap-2.5 px-3 text-[13px] text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <UserRound size={15} strokeWidth={1.6} />
            Profile & addresses
          </Link>
          <Link
            to="/order-history"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-9 items-center gap-2.5 px-3 text-[13px] text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <Store size={15} strokeWidth={1.6} />
            Order history
          </Link>
          <div className="h-px bg-rule" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              signOut()
              toast.success('Signed out. The basket stays on this device.')
              navigate('/login')
            }}
            className="flex h-9 w-full items-center gap-2.5 px-3 text-[13px] text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <LogOut size={15} strokeWidth={1.6} />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { itemCount } = useCart()
  const { status, source } = useCatalog()
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    setSheet(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheet])

  return (
    <div className="min-h-svh bg-ground">
      <a href="#main" className="skip-link">
        Skip to the page
      </a>
      <div className="mx-auto grid min-h-svh max-w-[1560px] lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="app-rail hidden h-svh flex-col gap-2 bg-board px-4 py-5 text-board-type lg:flex">
          <Link to="/" className="mb-5 px-2 pt-1" aria-label="Dabba home">
            <BoardWordmark />
          </Link>
          <SidebarNav />
          <div className="mt-2 border-t border-board-3 pt-2">
            <AccountMenu />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center gap-2 bg-board text-board-type px-4 lg:hidden">
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="btn btn-ghost h-9 w-9 p-0 text-board-muted hover:bg-board-2 hover:text-board-type"
              aria-label="Open navigation"
              aria-expanded={sheet}
            >
              <Menu size={18} strokeWidth={1.7} />
            </button>
            <Link to="/" aria-label="Dabba home" className="mr-auto">
              <BoardWordmark compact />
            </Link>
            <Link
              to="/cart"
              className="relative grid h-9 w-9 place-items-center rounded-[6px] text-board-muted transition-colors hover:bg-board-2 hover:text-board-type"
              aria-label={`Basket, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBasket size={18} strokeWidth={1.7} />
              {itemCount > 0 ? (
                <span className="num absolute top-0.5 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[11px] leading-none font-semibold text-brand-ink">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </header>

          <div className="h-12 shrink-0 lg:hidden" aria-hidden="true" />

          <main id="main" className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-7">
            {source === 'bundled' && status === 'degraded' ? (
              <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[6px] bg-pill-warning-bg px-3 py-2 text-[13px] leading-5 text-pill-warning-ink shadow-[inset_0_0_0_1px_var(--color-pill-warning-edge)]">
                <span className="font-medium">Showing the bundled catalogue.</span>
                <span>The recipe service did not answer; dishes and photographs still work.</span>
              </div>
            ) : null}
            {children}
          </main>
        </div>
      </div>

      {sheet ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSheet(false)}
            className="absolute inset-0 overlay"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="sheet-enter relative flex h-full w-[min(84vw,300px)] flex-col bg-board px-4 py-5 text-board-type"
          >
            <div className="mb-5 flex items-center justify-between px-2 pt-1">
              <BoardWordmark compact />
              <button
                type="button"
                onClick={() => setSheet(false)}
                className="btn btn-ghost h-9 w-9 p-0 text-board-muted hover:bg-board-2 hover:text-board-type"
                aria-label="Close navigation"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav onNavigate={() => setSheet(false)} />
            </div>
            <div className="mt-2 border-t border-board-3 pt-2">
              <AccountMenu compact />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
