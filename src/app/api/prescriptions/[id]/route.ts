import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { prescriptionService } from '@/lib/services/prescription.service'
import { updatePrescriptionSchema } from '@/lib/validations/prescription'
import { Role } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const prescription = await prescriptionService.getPrescriptionById(
      params.id,
      session.profileId,
      session.role
    )

    return NextResponse.json({
      success: true,
      data: prescription,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch prescription' },
      { status: 400 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { success: false, error: 'Only doctors can update prescriptions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updatePrescriptionSchema.parse(body)
    
    const prescription = await prescriptionService.updatePrescription(
      params.id,
      session.profileId,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: prescription,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update prescription' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { success: false, error: 'Only doctors can delete prescriptions' },
        { status: 403 }
      )
    }

    await prescriptionService.deletePrescription(
      params.id,
      session.profileId
    )

    return NextResponse.json({
      success: true,
      message: 'Prescription deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete prescription' },
      { status: 400 }
    )
  }
}


