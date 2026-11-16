import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TiffinMark } from './TiffinMark'
import { Clock3 } from 'lucide-react'

/** The auth pages share one frame: a narrow form column and a tall picture of the service. */
export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="min-h-svh bg-ground">
      <div className="mx-auto grid min-h-svh max-w-[1240px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-14 lg:py-9">
          <Link to="/" className="mb-10 inline-flex items-center gap-2.5 self-start" aria-label="Dabba home">
            <TiffinMark size={26} className="text-brand-deep" />
            <span className="text-[17px] font-semibold tracking-[-0.015em]">dabba</span>
          </Link>

          <div className="w-full max-w-[380px]">
            <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.025em]">{title}</h1>
            <p className="mt-2 text-[14px] leading-6 text-muted">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-10 text-[12px] leading-4 text-faint">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={12} strokeWidth={1.7} />
              Dinner window 17:00 to 23:00
            </span>
            <span>Recipe catalogue by DummyJSON</span>
            <span>Sample service data</span>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-sunken lg:block">
          <img
            src={new URL('../../assets/photos/dabbawala-jpg.jpg', import.meta.url).href}
            alt="A dabbawala lifting a steel tiffin carrier from a bicycle stacked with lunch boxes"
            className="photo absolute inset-0 h-full w-full object-cover object-[center_62%]"
            width={1920}
            height={1438}
            fetchPriority="high"
          />
          {/* A warm scrim under the caption on a photograph is the one gradient the house rules keep. */}
          <div className="photo-scrim absolute inset-0" />
          <div className="photo-caption absolute inset-x-0 bottom-0 p-9 pt-28">
            <p className="max-w-[34ch] text-[23px] leading-8 font-medium tracking-[-0.01em] text-invert">
              Every tiffin is cooked once, packed once and followed from the pass to the door.
            </p>
            <p className="mt-3 max-w-[46ch] text-[12px] leading-5 text-invert/75">
              Dadar, Mumbai. A dabbawala loads coded tiffin carriers onto the bicycle before the dinner run.
              Photograph by Joe Zachs, CC BY 2.0, via Wikimedia Commons.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
