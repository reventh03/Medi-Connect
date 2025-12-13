import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { AuthUser } from '@/types'

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function setSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}


