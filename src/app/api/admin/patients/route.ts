import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'
import { createPatientByAdminSchema } from '@/lib/validations/admin'
import { getSession } from '@/lib/utils/session'
import { Role } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (session.role !== Role.DOCTOR) {
      return NextResponse.json(
        { success: false, error: 'Only doctors can create patients' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const validatedData = createPatientByAdminSchema.parse(body)
    
    const result = await authService.createPatientByDoctor(validatedData)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create patient',
      },
      { status: 400 }
    )
  }
}

