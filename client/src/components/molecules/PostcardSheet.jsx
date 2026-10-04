import PostcardFront from './PostcardFront.jsx'
import PostcardBack from './PostcardBack.jsx'

// Front above back, at a fixed width, for downloading as one image. A fixed
// width means the file looks the same whatever screen it was saved from.
export default function PostcardSheet({ postcard, dateLabel, ref }) {
  return (
    <div ref={ref} className="w-[750px] space-y-6 bg-bg p-8">
      <PostcardFront imageUrl={postcard.imageUrl} templateSlug={postcard.templateSlug} eager />
      <PostcardBack caption={postcard.caption} dateLabel={dateLabel} />
      <p className="text-center font-type text-small text-primary-strong">Postly · {dateLabel}</p>
    </div>
  )
}
