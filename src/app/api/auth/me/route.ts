import { NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: { user: session },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get session',
      },
      { status: 400 }
    )
  }
}


