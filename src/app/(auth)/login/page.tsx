'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Heart, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MediConnect</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your Health,
            <br />
            Our Priority
          </h1>
          <p className="text-indigo-100 text-lg">
            Connect with healthcare professionals and manage your medical records seamlessly
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Secure & Private</h3>
              <p className="text-indigo-100 text-sm">Your medical data is protected with advanced security</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Easy Access</h3>
              <p className="text-indigo-100 text-sm">View appointments, prescriptions, and medical records anytime</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-indigo-200 text-sm">
          © 2025 MediConnect. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">MediConnect</span>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">New to MediConnect?</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/register">
                    Create an account
                  </Link>
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Link href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

