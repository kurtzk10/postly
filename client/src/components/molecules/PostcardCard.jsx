import { Link } from 'react-router'
import PostcardFront from './PostcardFront.jsx'
import { formatPostcardDate } from '../../lib/dates.js'

export default function PostcardCard({ postcard }) {
  const date = formatPostcardDate(postcard.date)
  return (
    <Link
      to={`/gallery/${postcard.id}`}
      className="flex h-full flex-col gap-2 rounded-xl bg-surface p-3 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <article className="contents">
        <PostcardFront
          imageUrl={postcard.imageUrl}
          templateSlug={postcard.templateSlug}
          alt={postcard.caption || `Postcard from ${date}`}
          compact
        />
        <p className="line-clamp-2 min-h-[3em]">{postcard.caption || <span className="text-primary-strong">No caption</span>}</p>
        <p className="text-small text-primary-strong">
          <time dateTime={postcard.date}>{date}</time> · {postcard.templateName}
        </p>
      </article>
    </Link>
  )
}
