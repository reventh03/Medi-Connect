import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { medicalRecordService } from '@/lib/services/medical-record.service'
import { createMedicalRecordSchema } from '@/lib/validations/medical-record'
import { saveFileLocally } from '@/lib/utils/file-upload'
import { prisma } from '@/lib/prisma'
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

    let records
    if (session.role === Role.PATIENT) {
      records = await medicalRecordService.getMedicalRecordsByPatient(session.profileId)
    } else if (session.role === Role.DOCTOR) {
      records = await medicalRecordService.getMedicalRecordsByDoctor(session.profileId)
    }

    return NextResponse.json({
      success: true,
      data: records,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch medical records' },
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
        { success: false, error: 'Only doctors can create medical records' },
        { status: 403 }
      )
    }

    // Always try to parse as FormData first (supports both file and non-file submissions)
    const contentType = request.headers.get('content-type') || ''
    
    console.log('Content-Type:', contentType)
    
    // Try to get FormData
    let formData: FormData | null = null
    try {
      formData = await request.formData()
      console.log('Parsed as FormData')
    } catch (e) {
      console.log('Not FormData, trying JSON')
    }
    
    if (formData) {
      // Handle FormData submission
      const patientId = formData.get('patientId') as string
      const diagnosis = formData.get('diagnosis') as string
      const symptoms = formData.get('symptoms') as string
      const notes = formData.get('notes') as string | null
      const file = formData.get('file') as File | null
      
      console.log('FormData parsed:', { patientId, diagnosis, symptoms, hasFile: !!file })
      
      // Create medical record
      const record = await medicalRecordService.createMedicalRecord(
        session.profileId,
        {
          patientId,
          diagnosis,
          symptoms,
          notes,
        }
      )
      
      // If file is uploaded, save it and create test result
      if (file && file.size > 0) {
        console.log('Processing file:', file.name, file.size)
        const fileUrl = await saveFileLocally(file, 'medical-records')
        console.log('File saved to:', fileUrl)
        
        await prisma.testResult.create({
          data: {
            patientId,
            doctorId: session.profileId,
            medicalRecordId: record.id,
            testName: file.name,
            testDate: new Date(),
            resultValue: 'File attached',
            fileUrl,
          },
        })
        console.log('Test result created with file')
      } else {
        console.log('No file to process')
      }

      return NextResponse.json({
        success: true,
        data: record,
      })
    } else {
      // Fallback to JSON parsing
      const body = await request.json()
      const validatedData = createMedicalRecordSchema.parse(body)
      
      const record = await medicalRecordService.createMedicalRecord(
        session.profileId,
        validatedData
      )

      return NextResponse.json({
        success: true,
        data: record,
      })
    }
  } catch (error: any) {
    console.error('Error creating medical record:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create medical record' },
      { status: 400 }
    )
  }
}


