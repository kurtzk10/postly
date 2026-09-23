import { Outlet } from 'react-router'
import Header from '../components/organisms/Header.jsx'
import Footer from '../components/organisms/Footer.jsx'

export default function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
