// Each template is a different frame around the same photo. The slugs match
// the rows seeded into the templates table.
const FRAMES = {
  classic: {
    outer: 'bg-bg p-[3%] ring-1 ring-primary/40',
    photo: '',
  },
  polaroid: {
    outer: 'bg-white px-[4%] pt-[4%] pb-[14%] shadow-md',
    photo: '',
  },
  airmail: {
    // Diagonal airmail stripes, in the palette's gold and slate
    outer:
      'p-[4%] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-bg)_12px_20px,var(--color-primary-strong)_20px_32px,var(--color-bg)_32px_40px)]',
    photo: 'ring-4 ring-bg',
  },
}

// eager: load the photo straight away, for the download sheet, which is
// off-screen, where a lazy image would never load.
export default function PostcardFront({ imageUrl, templateSlug = 'classic', alt = '', compact = false, eager = false }) {
  const frame = FRAMES[templateSlug] ?? FRAMES.classic

  return (
    <div className={`relative aspect-[3/2] w-full overflow-hidden rounded-md ${frame.outer}`}>
      <div className={`relative h-full w-full overflow-hidden bg-surface ${frame.photo}`}>
        {imageUrl ? (
          // crossOrigin lets the download copy this photo's pixels. Cloudinary allows it.
          <img
            src={imageUrl}
            alt={alt}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
            loading={eager ? 'eager' : 'lazy'}
          />
        ) : (
          <div className={`flex h-full items-center justify-center text-center text-primary-strong ${compact ? 'text-small' : ''}`}>
            {compact ? 'photo' : "Today's photo goes here"}
          </div>
        )}
      </div>
      {templateSlug === 'polaroid' && !compact && (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-[3%] text-center font-type text-small text-text">
          Postly
        </span>
      )}
    </div>
  )
}
