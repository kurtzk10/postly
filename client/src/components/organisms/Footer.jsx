export default function Footer() {
  return (
    <footer className="border-t border-primary/40 bg-surface">
      <p className="mx-auto max-w-6xl px-6 py-4 text-small text-primary-strong">
        © {new Date().getFullYear()} Postly · a daily postcard, just for you
      </p>
    </footer>
  )
}
