import { Link } from 'react-router'

export default function Logo() {
  return (
    <Link to="/capture" className="flex items-center gap-2 font-type text-heading font-bold text-text">
      <img src="/favicon.svg" alt="" className="size-8" />
      Postly
    </Link>
  )
}
