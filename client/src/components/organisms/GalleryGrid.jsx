import PostcardCard from '../molecules/PostcardCard.jsx'

export default function GalleryGrid({ postcards }) {
  return (
    <ul className="grid grid-cols-1 gap-8 min-[400px]:grid-cols-2 lg:grid-cols-4">
      {postcards.map((p) => (
        <li key={p.id}>
          <PostcardCard postcard={p} />
        </li>
      ))}
    </ul>
  )
}
