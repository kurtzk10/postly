import { Link } from 'react-router'
import { useAuth } from '../context/auth.js'
import AuthForm from '../components/organisms/AuthForm.jsx'

export default function SignupPage() {
  const { signup } = useAuth()

  return (
    <section className="space-y-6">
      <h1 className="text-heading">Create your account</h1>
      <AuthForm mode="signup" onSubmit={signup} />
      <p className="text-center text-small">
        Already have one?{' '}
        <Link to="/login" className="font-semibold text-primary-strong underline">
          Log in
        </Link>
      </p>
    </section>
  )
}
