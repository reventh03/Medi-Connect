import { NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { appointmentService } from '@/lib/services/appointment.service'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const doctors = await appointmentService.getDoctors()

    return NextResponse.json({
      success: true,
      data: doctors,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch doctors' },
      { status: 400 }
    )
  }
}


