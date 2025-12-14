import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'
import { changePasswordSchema } from '@/lib/validations/admin'
import { getSession } from '@/lib/utils/session'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const validatedData = changePasswordSchema.parse(body)
    
    await authService.changePassword(session.id, validatedData)
    
    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to change password',
      },
      { status: 400 }
    )
  }
}

