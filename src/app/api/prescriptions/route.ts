import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { prescriptionService } from '@/lib/services/prescription.service'
import { createPrescriptionSchema } from '@/lib/validations/prescription'
import { Role } from '@prisma/client'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    let prescriptions
    if (session.role === Role.PATIENT) {
      prescriptions = await prescriptionService.getPrescriptionsByPatient(session.profileId)
    } else if (session.role === Role.DOCTOR) {
      prescriptions = await prescriptionService.getPrescriptionsByDoctor(session.profileId)
    }

    return NextResponse.json({
      success: true,
      data: prescriptions,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch prescriptions' },
      { status: 400 }
    )
  }
}

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
        { success: false, error: 'Only doctors can create prescriptions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createPrescriptionSchema.parse(body)
    
    const prescription = await prescriptionService.createPrescription(
      session.profileId,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: prescription,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create prescription' },
      { status: 400 }
    )
  }
}


