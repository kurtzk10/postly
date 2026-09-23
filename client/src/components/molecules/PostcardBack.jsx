import Stamp from '../atoms/Stamp.jsx'

// The written side: caption on the left, stamp and date on the right,
// split by a divider like a real postcard.
export default function PostcardBack({ caption, dateLabel }) {
  return (
    <div className="grid aspect-[3/2] w-full grid-cols-[3fr_2fr] gap-4 rounded-md bg-bg p-4 font-type ring-1 ring-primary/40 sm:p-6">
      <p className="overflow-hidden break-words border-r border-primary pr-4 text-body leading-relaxed">
        {caption || <span className="text-primary-strong">Your caption will appear here.</span>}
      </p>
      <div className="flex flex-col items-end justify-between">
        <Stamp className="w-12 sm:w-14" />
        <div className="w-full space-y-3 text-small">
          <p className="border-b border-primary pb-1">{dateLabel}</p>
          <p className="border-b border-primary pb-1">To: future me</p>
        </div>
      </div>
    </div>
  )
}
