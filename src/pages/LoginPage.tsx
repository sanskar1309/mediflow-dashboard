import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

type Mode = 'signin' | 'signup'

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setError, error, clearError } = useAuthStore()

  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function switchMode(m: Mode) {
    setMode(m)
    clearError()
    setFieldErrors({})
    setPassword('')
    setConfirmPassword('')
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (mode === 'signup' && !fullName.trim()) errors.fullName = 'Full name is required'
    if (!email) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (mode === 'signup') {
      if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
      else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function friendlyError(msg: string, isSignup = false): string {
    if (msg.includes('email-already-in-use')) return 'An account with this email already exists. Sign in instead.'
    if (msg.includes('invalid-credential') || msg.includes('wrong-password')) return 'Invalid email or password.'
    if (msg.includes('user-not-found')) return 'No account found with this email. Sign up instead.'
    if (msg.includes('too-many-requests')) return 'Too many attempts. Please try again later.'
    if (msg.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.'
    return isSignup ? 'Sign up failed. Please try again.' : 'Sign in failed. Please try again.'
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    if (!validate()) return
    setLoading(true)
    try {
      const user = mode === 'signup'
        ? await authService.signUpWithEmail(email, password, fullName.trim())
        : await authService.loginWithEmail(email, password)
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setError(friendlyError(msg, mode === 'signup'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    clearError()
    setLoading(true)
    try {
      const user = await authService.loginWithGoogle()
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (!msg.includes('popup-closed')) setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">MediFlow</span>
        </div>
        <div>
          <blockquote className="text-2xl font-light leading-relaxed text-slate-300">
            "Empowering healthcare professionals with the tools they need to deliver exceptional patient care — every day."
          </blockquote>
          <div className="mt-8 flex gap-8">
            {[
              { value: '2,400+', label: 'Patients Managed' },
              { value: '98%', label: 'Uptime SLA' },
              { value: '50+', label: 'Hospital Partners' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} MediFlow Inc. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MediFlow</span>
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cn(
                  'flex-1 rounded-lg py-2 text-sm font-medium transition-all',
                  mode === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'signin'
                ? 'Sign in to your MediFlow account'
                : 'Create your MediFlow account — it\'s free'}
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                {error}
                {error.includes('Sign in instead') && (
                  <button onClick={() => switchMode('signin')} className="ml-1 font-semibold underline">Sign in</button>
                )}
                {error.includes('Sign up instead') && (
                  <button onClick={() => switchMode('signup')} className="ml-1 font-semibold underline">Sign up</button>
                )}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {/* Full name — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: '' })) }}
                    className={cn('pl-9', fieldErrors.fullName && 'border-red-400')}
                    autoComplete="name"
                  />
                </div>
                {fieldErrors.fullName && <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@hospital.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                  className={cn('pl-9', fieldErrors.email && 'border-red-400')}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password</label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                  className={cn('pl-9 pr-10', fieldErrors.password && 'border-red-400')}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            {/* Confirm password — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })) }}
                    className={cn('pl-9 pr-10', fieldErrors.confirmPassword && 'border-red-400')}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                </span>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-50 px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" size="lg" disabled={loading} onClick={handleGoogle}>
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-gray-400">
            Protected by enterprise-grade security. HIPAA compliant.
          </p>
        </div>
      </div>
    </div>
  )
}
