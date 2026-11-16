import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { PageHeader } from '../../components/ui/Page'
import { RestaurantCard } from '../../components/catalog/Cards'
import { SkeletonCards, EmptyState } from '../../components/ui/Feedback'
import { useCatalog } from '../../hooks/useApp'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { dishRating, dishReviewTotal, normalize } from '../../lib/catalog'
import { formatOpenState } from '../../lib/format'
import { cn } from '../../lib/cn'

type SortKey = 'popular' | 'rating' | 'fastest' | 'cheapest'
type RatingFloor = 'any' | '4.5' | '4.0' | '3.5'
type OpenFilter = 'any' | 'open'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Most ordered' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'fastest', label: 'Fastest delivery' },
  { id: 'cheapest', label: 'Lowest fee' },
]

const RATING_FLOORS: { id: RatingFloor; label: string }[] = [
  { id: 'any', label: 'Any rating' },
  { id: '4.5', label: '4.5 and up' },
  { id: '4.0', label: '4.0 and up' },
  { id: '3.5', label: '3.5 and up' },
]

/** Six to a page, so the roster's second page is real rather than a stub. */
const PAGE_SIZE = 6

export function RestaurantsPage() {
  useDocumentTitle('Restaurants')
  const { kitchens, dishes, status } = useCatalog()

  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('all')
  const [rating, setRating] = useState<RatingFloor>('any')
  const [openOnly, setOpenOnly] = useState<OpenFilter>('any')
  const [sort, setSort] = useState<SortKey>('popular')
  const [page, setPage] = useState(1)

  /** Every kitchen with its own dishes and the figures derived from them. */
  const roster = useMemo(
    () =>
      kitchens.map((kitchen) => {
        const own = dishes.filter((dish) => dish.kitchenId === kitchen.id)
        return {
          kitchen,
          own,
          rating: dishRating(own),
          reviews: dishReviewTotal(own),
          open: formatOpenState(kitchen.openTime, kitchen.closeTime).open,
        }
      }),
    [kitchens, dishes],
  )

  const cuisines = useMemo(
    () => [...new Set(roster.map((row) => row.kitchen.cuisine))].sort((a, b) => a.localeCompare(b)),
    [roster],
  )

  const filtered = useMemo(() => {
    const needle = normalize(query)
    const floor = rating === 'any' ? 0 : Number(rating)

    const matches = roster.filter((row) => {
      const { kitchen } = row
      if (cuisine !== 'all' && kitchen.cuisine !== cuisine) return false
      if (row.rating < floor) return false
      if (openOnly === 'open' && !row.open) return false
      if (!needle) return true
      return (
        normalize(kitchen.name).includes(needle) ||
        normalize(kitchen.cuisine).includes(needle) ||
        normalize(kitchen.area).includes(needle) ||
        normalize(kitchen.blurb).includes(needle) ||
        kitchen.tags.some((tag) => normalize(tag).includes(needle)) ||
        row.own.some((dish) => normalize(dish.name).includes(needle))
      )
    })

    return matches.sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating || b.reviews - a.reviews
        case 'fastest':
          return a.kitchen.deliveryMinutes - b.kitchen.deliveryMinutes
        case 'cheapest':
          return a.kitchen.deliveryFee - b.kitchen.deliveryFee
        default:
          return b.reviews - a.reviews || b.rating - a.rating
      }
    })
  }, [roster, query, cuisine, rating, openOnly, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const shown = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const openCount = roster.filter((row) => row.open).length
  const loading = status === 'loading'
  const filtering = Boolean(query) || cuisine !== 'all' || rating !== 'any' || openOnly !== 'any'

  const reset = () => {
    setQuery('')
    setCuisine('all')
    setRating('any')
    setOpenOnly('any')
    setSort('popular')
    setPage(1)
  }

  /** Any control that narrows the list sends the reader back to its first page. */
  const narrow = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="app-fade">
      <PageHeader
        title="Restaurants"
        finding={
          <>
            {roster.length} kitchens on the roster, {openCount} open for the current window. Every kitchen
            keeps its own basket, its own fee and its own rider.
          </>
        }
        actions={
          <Link to="/menu" className="btn btn-primary">
            <Search size={15} strokeWidth={1.7} />
            Find a dish
          </Link>
        }
      />

      <div className="panel mb-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={15}
              strokeWidth={1.7}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => narrow(setQuery)(event.target.value)}
              placeholder="Kitchen, cuisine, area or dish"
              aria-label="Search restaurants"
              className="field h-9 pl-9"
            />
          </div>

          <label className="sr-only" htmlFor="cuisine-filter">
            Filter by cuisine
          </label>
          <select
            id="cuisine-filter"
            className="field h-9 w-auto min-w-[148px]"
            value={cuisine}
            onChange={(event) => narrow(setCuisine)(event.target.value)}
          >
            <option value="all">Every cuisine</option>
            {cuisines.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="rating-filter">
            Filter by rating
          </label>
          <select
            id="rating-filter"
            className="field h-9 w-auto min-w-[132px]"
            value={rating}
            onChange={(event) => narrow(setRating)(event.target.value as RatingFloor)}
          >
            {RATING_FLOORS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="sort-restaurants">
            Sort restaurants
          </label>
          <select
            id="sort-restaurants"
            className="field h-9 w-auto min-w-[152px]"
            value={sort}
            onChange={(event) => narrow(setSort)(event.target.value as SortKey)}
          >
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="inline-flex h-9 items-center gap-0.5 rounded-[6px] bg-sunken p-0.5" role="group" aria-label="Filter by open state">
            {(
              [
                { id: 'any', label: 'All' },
                { id: 'open', label: 'Open now' },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => narrow(setOpenOnly)(option.id)}
                aria-pressed={openOnly === option.id}
                className={cn(
                  'h-8 rounded-[4px] px-2.5 text-[13px] font-medium transition-colors',
                  openOnly === option.id ? 'bg-surface text-ink shadow-[var(--shadow-chip)]' : 'text-muted hover:text-ink',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {filtering ? (
            <button type="button" onClick={reset} className="btn btn-ghost btn-sm">
              <X size={13} strokeWidth={1.8} />
              Clear filters
            </button>
          ) : null}
        </div>

        <p className="mt-2.5 flex items-center gap-1.5 text-[12px] leading-4 text-faint">
          <SlidersHorizontal size={12} strokeWidth={1.7} />
          {filtered.length === roster.length
            ? pageCount > 1
              ? `All ${roster.length} kitchens`
              : `Showing all ${roster.length} kitchens`
            : `${filtered.length} of ${roster.length} kitchens match`}
          {pageCount > 1 ? ` · page ${safePage} of ${pageCount}` : ''}
        </p>
      </div>

      {loading ? (
        <SkeletonCards count={6} />
      ) : !roster.length ? (
        <div className="panel">
          <EmptyState
            icon={<MapPin size={22} strokeWidth={1.4} />}
            title="No kitchens are on the roster"
            body="The catalogue service answered with no dishes, so there are no kitchens to show. Reload the catalogue from the overview."
          />
        </div>
      ) : !filtered.length ? (
        <div className="panel">
          <EmptyState
            icon={<Search size={22} strokeWidth={1.4} />}
            title="No kitchen matches those filters"
            body="Try a shorter search, a different cuisine, or a lower rating floor. The whole roster is still open behind Clear filters."
            action={
              <button type="button" onClick={reset} className="btn btn-secondary btn-sm">
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((row, index) => (
              <RestaurantCard
                key={row.kitchen.id}
                kitchen={row.kitchen}
                dishes={row.own}
                priority={index === 0 && safePage === 1}
              />
            ))}
          </div>

          {pageCount > 1 ? (
            <nav
              className="mt-3 flex items-center justify-between gap-3 rounded-[8px] bg-surface px-3 py-2 shadow-[var(--edge-stock)]"
              aria-label="Restaurant pages"
            >
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={safePage === 1}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={14} strokeWidth={1.8} />
                Previous
              </button>

              <ol className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                  <li key={number}>
                    <button
                      type="button"
                      onClick={() => setPage(number)}
                      aria-current={number === safePage ? 'page' : undefined}
                      aria-label={`Page ${number} of ${pageCount}`}
                      className={cn(
                        'num grid h-8 min-w-8 place-items-center rounded-[5px] px-2 text-[13px] font-medium transition-colors',
                        number === safePage
                          ? 'bg-brand text-brand-ink shadow-[var(--lit-edge)]'
                          : 'text-muted hover:bg-raised hover:text-ink',
                      )}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                disabled={safePage === pageCount}
                className="btn btn-secondary btn-sm"
              >
                Next
                <ChevronRight size={14} strokeWidth={1.8} />
              </button>
            </nav>
          ) : null}
        </>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-[15px] leading-5 font-semibold">How the roster works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: 'One kitchen per basket',
              body: 'Dishes from a single kitchen share a packing bench and a rider. Adding from another kitchen asks before it replaces the basket.',
            },
            {
              title: 'Ratings come from dishes',
              body: 'A kitchen’s rating and review count are weighted across the dishes on its menu, so nothing is typed in twice.',
            },
            {
              title: 'Hours are the kitchen’s own',
              body: 'Dosa Junction serves breakfast and lunch; everyone else runs dinner. Closed kitchens stay on the roster but cannot take a basket.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[8px] bg-surface px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <p className="text-[13px] leading-5 font-medium">{item.title}</p>
              <p className="mt-1 text-[13px] leading-[18px] text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-5 text-[13px] leading-4 text-faint">
        Prices are the lowest on each menu. Ratings and photographs come from the DummyJSON recipe
        catalogue; kitchens, addresses and hours are sample data for this demonstration.
      </p>
    </div>
  )
}
