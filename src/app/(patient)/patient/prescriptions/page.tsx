'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pill, User, Calendar, Download, FileText } from 'lucide-react'
import { downloadPrescriptionPDF } from '@/lib/utils/pdf-generator'

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string | null
  fileUrl: string | null
  createdAt: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
}

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [patientName, setPatientName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions')
      const data = await response.json()
      
      if (data.success) {
        setPrescriptions(data.data)
      }
      
      // Get patient name
      const meResponse = await fetch('/api/auth/me')
      const meData = await meResponse.json()
      if (meData.success) {
        setPatientName(`${meData.data.firstName} ${meData.data.lastName}`)
      }
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (prescription: Prescription) => {
    downloadPrescriptionPDF(prescription, patientName)
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="mt-2 text-gray-600">View your current and past prescriptions</p>
      </div>

      <div className="grid gap-4">
        {prescriptions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">No prescriptions found</p>
            </CardContent>
          </Card>
        ) : (
          prescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Pill className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {prescription.medication}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>Prescribed by Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(prescription)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 space-y-3 border border-indigo-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-indigo-900">Dosage:</span>
                          <p className="text-indigo-800 font-semibold">{prescription.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium text-indigo-900">Frequency:</span>
                          <p className="text-indigo-800 font-semibold">{prescription.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-indigo-900">Duration:</span>
                          <p className="text-indigo-800 font-semibold">{prescription.duration}</p>
                        </div>
                      </div>

                      {prescription.instructions && (
                        <div className="pt-3 border-t border-indigo-200">
                          <span className="text-sm font-medium text-indigo-900">Instructions:</span>
                          <p className="mt-1 text-sm text-indigo-800">{prescription.instructions}</p>
                        </div>
                      )}
                    </div>

                    {prescription.fileUrl && (
                      <div className="mt-4">
                        <a
                          href={prescription.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-gray-50 border border-indigo-200 rounded-lg transition-colors group"
                        >
                          <FileText className="h-5 w-5 text-indigo-600" />
                          <span className="text-sm font-medium text-indigo-900">View Prescription Document</span>
                          <Download className="h-4 w-4 text-indigo-600 group-hover:text-indigo-800" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}


