import { Link } from 'react-router'
import { useAuth } from '../context/auth.js'
import AuthForm from '../components/organisms/AuthForm.jsx'

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <section className="space-y-6">
      <h1 className="text-heading">Log in</h1>
      <AuthForm mode="login" onSubmit={login} />
      <p className="text-center text-small">
        New to Postly?{' '}
        <Link to="/signup" className="font-semibold text-primary-strong underline">
          Create an account
        </Link>
      </p>
    </section>
  )
}
