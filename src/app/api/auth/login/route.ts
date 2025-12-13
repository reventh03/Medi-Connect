import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'
import { loginSchema } from '@/lib/validations/auth'
import { setSession } from '@/lib/utils/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = loginSchema.parse(body)
    
    const { user, token } = await authService.login(validatedData)
    
    await setSession(token)
    
    return NextResponse.json({
      success: true,
      data: { user },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Login failed',
      },
      { status: 400 }
    )
  }
}


