import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { medicalRecordService } from '@/lib/services/medical-record.service'
import { updateMedicalRecordSchema } from '@/lib/validations/medical-record'
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

    const record = await medicalRecordService.getMedicalRecordById(
      params.id,
      session.profileId,
      session.role
    )

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch medical record' },
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
        { success: false, error: 'Only doctors can update medical records' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateMedicalRecordSchema.parse(body)
    
    const record = await medicalRecordService.updateMedicalRecord(
      params.id,
      session.profileId,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update medical record' },
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
        { success: false, error: 'Only doctors can delete medical records' },
        { status: 403 }
      )
    }

    await medicalRecordService.deleteMedicalRecord(
      params.id,
      session.profileId
    )

    return NextResponse.json({
      success: true,
      message: 'Medical record deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete medical record' },
      { status: 400 }
    )
  }
}


