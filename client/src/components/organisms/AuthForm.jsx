import { useState } from 'react'
import Button from '../atoms/Button.jsx'
import Input from '../atoms/Input.jsx'
import Label from '../atoms/Label.jsx'

// The shared email + password form behind both /login and /signup.
// `onSubmit(email, password)` should throw an Error whose message we show.
export default function AuthForm({ mode, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const isSignup = mode === 'signup'

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="auth-email">Email</Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="auth-password">Password</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          required
          minLength={isSignup ? 8 : undefined}
          maxLength={72}
          aria-describedby={isSignup ? 'auth-password-hint' : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignup && (
          <p id="auth-password-hint" className="text-small text-primary-strong">
            At least 8 characters.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-small font-semibold text-red-800">
          {error}
        </p>
      )}

      <Button type="submit" variant="accent" className="w-full" disabled={busy}>
        {busy ? 'One moment…' : isSignup ? 'Create account' : 'Log in'}
      </Button>
    </form>
  )
}
