import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Dish } from '../../types'
import { formatINR } from '../../lib/format'
import { DietMark } from '../ui/Status'
import { cn } from '../../lib/cn'

export function DishRow({
  dish,
  kitchenName,
  onEdit,
  onDelete,
  onToggle,
  onAdd,
}: {
  dish: Dish
  kitchenName: string
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
  onAdd: () => void
}) {
  return (
    <li className="row-hover border-t border-rule first:border-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:flex-nowrap">
        <Link
          to={`/menu/${dish.id}`}
          aria-label={`Open ${dish.name}`}
          className="shrink-0"
        >
          <img
            src={dish.image}
            alt=""
            width={44}
            height={44}
            loading="eager" fetchPriority="high"
            className="photo h-11 w-11 rounded-[4px] object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1 basis-[calc(100%-3.5rem)] sm:basis-auto">
          <p className="flex min-w-0 items-center gap-1.5">
            <DietMark diet={dish.diet} />
            <Link
              to={`/menu/${dish.id}`}
              className="truncate text-[13px] leading-[18px] font-medium hover:underline"
            >
              {dish.name}
            </Link>
          </p>
          <p className="mt-0.5 flex items-baseline gap-1.5 text-[12px] leading-4 text-faint sm:text-[13px]">
            <span className="num font-medium text-ink lg:hidden">{formatINR(dish.price)}</span>
            <span className="min-w-0 truncate">
              {kitchenName} · {dish.cuisine}
              <span className="lg:hidden"> · {dish.category}</span>
              {!dish.available && dish.soldOutAt ? <span> · out since {dish.soldOutAt}</span> : null}
            </span>
          </p>
        </div>

        <span className="hidden w-[100px] shrink-0 text-[13px] leading-4 text-muted lg:block">
          {dish.category}
        </span>

        <span className="num hidden w-[90px] shrink-0 text-right text-[13px] leading-4 font-medium lg:block">
          {formatINR(dish.price)}
        </span>

        <span className="order-last w-[104px] shrink-0 sm:order-none">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={!dish.available}
            className={cn(
              'pill pill-control max-w-full transition-colors',
              dish.available ? 'pill-positive' : 'pill-warning',
            )}
            title={dish.available ? 'Mark sold out' : 'Put back on sale'}
          >
            <span className="dot" aria-hidden="true" />
            <span className="truncate">
              {dish.available ? 'On sale' : 'Sold out'}
            </span>
          </button>
        </span>

        <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
          <button
            type="button"
            onClick={onAdd}
            disabled={!dish.available}
            className="grid h-8 w-8 place-items-center rounded-[4px] text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${dish.name} to the basket`}
            title="Add to basket"
          >
            <Plus size={15} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-[4px] text-muted transition-colors hover:bg-raised hover:text-ink"
            aria-label={`Edit ${dish.name}`}
            title="Edit dish"
          >
            <Pencil size={14} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="grid h-8 w-8 place-items-center rounded-[4px] text-muted transition-colors hover:bg-pill-negative-bg hover:text-pill-negative-ink"
            aria-label={`Remove ${dish.name} from the menu`}
            title="Remove dish"
          >
            <Trash2 size={14} strokeWidth={1.7} />
          </button>
        </div>

        <div className="mt-1.5 flex items-center gap-1 border-t border-rule pt-1.5 sm:hidden">
          <button
            type="button"
            onClick={onAdd}
            disabled={!dish.available}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-[4px] text-[12px] font-medium text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${dish.name} to the basket`}
          >
            <Plus size={13} strokeWidth={1.8} />
            Add
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-[4px] text-[12px] font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
            aria-label={`Edit ${dish.name}`}
          >
            <Pencil size={13} strokeWidth={1.8} />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-[4px] text-[12px] font-medium text-muted transition-colors hover:bg-pill-negative-bg hover:text-pill-negative-ink"
            aria-label={`Remove ${dish.name} from the menu`}
          >
            <Trash2 size={13} strokeWidth={1.8} />
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
