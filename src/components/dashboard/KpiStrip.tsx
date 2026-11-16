import { cn } from '../../lib/cn'

export interface KpiCell {
  label: string
  value: string
  unit?: string
  note?: string
  /** True while the value's own source is still being fetched, so the cell keeps
   *  its final size with a flat bar instead of a dash that reads as "no data". */
  pending?: boolean
}

/** One divided container, label over value: the studied screens' default for headline numbers.
 *  The dividers are a 1px gap in the container's line colour, so any cell count lands level.
 *  The first cell is the evening's answer and sets a step larger. */
export function KpiStrip({
  cells,
  className,
}: {
  cells: KpiCell[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-[8px] bg-line shadow-[var(--shadow-card)] sm:grid-cols-4',
        className,
      )}
    >
      {cells.map((cell, index) => (
        <div
          key={cell.label}
          className={cn('min-w-0 px-4 py-3.5', index === 0 ? 'bg-brand-wash' : 'bg-surface')}
        >
          <p className="truncate text-[12px] leading-4 font-medium text-muted">{cell.label}</p>
          {cell.pending ? (
            <div className="skeleton mt-2 h-6 w-14" aria-hidden="true" />
          ) : (
            <p
              className={cn(
                'num mt-1 truncate font-medium tracking-[-0.02em]',
                index === 0
                  ? 'text-[32px] leading-9 text-ink'
                  : 'text-[21px] leading-7 text-ink',
              )}
            >
              {cell.value}
              {cell.unit ? (
                <span className="ml-1 text-[13px] font-normal tracking-normal text-muted">{cell.unit}</span>
              ) : null}
            </p>
          )}
          {cell.note ? (
            <p className="mt-0.5 text-[12px] leading-4 text-faint">{cell.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
