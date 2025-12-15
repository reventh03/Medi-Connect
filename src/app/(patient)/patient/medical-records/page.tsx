'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, User, Calendar, Download, File } from 'lucide-react'
import { downloadMedicalRecordPDF } from '@/lib/utils/pdf-generator'

interface MedicalRecord {
  id: string
  diagnosis: string
  symptoms: string
  notes: string | null
  createdAt: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
  appointment: {
    appointmentDate: string
  } | null
  testResults: Array<{
    id: string
    testName: string
    testDate: string
    fileUrl: string | null
    resultValue: string
    notes: string | null
  }>
}

export default function PatientMedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [patientName, setPatientName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/medical-records')
      const data = await response.json()
      
      if (data.success) {
        setRecords(data.data)
      }
      
      // Get patient name from session
      const meResponse = await fetch('/api/auth/me')
      const meData = await meResponse.json()
      if (meData.success) {
        setPatientName(`${meData.data.firstName} ${meData.data.lastName}`)
      }
    } catch (err) {
      console.error('Failed to fetch records:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (record: MedicalRecord) => {
    downloadMedicalRecordPDF(record, patientName)
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
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="mt-2 text-gray-600">View your medical history</p>
      </div>

      <div className="grid gap-4">
        {records.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">No medical records found</p>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {record.doctor.firstName} {record.doctor.lastName}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500">{record.doctor.specialization}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(record.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(record)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-blue-900">Diagnosis:</span>
                        <p className="mt-1 text-blue-900 font-semibold">{record.diagnosis}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Symptoms:</span>
                        <p className="mt-1 text-gray-600">{record.symptoms}</p>
                      </div>

                      {record.notes && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Doctor's Notes:</span>
                          <p className="mt-1 text-gray-600">{record.notes}</p>
                        </div>
                      )}

                      {record.appointment && (
                        <div className="pt-3 border-t border-gray-100 text-sm text-gray-500">
                          Related to appointment on {new Date(record.appointment.appointmentDate).toLocaleDateString()}
                        </div>
                      )}

                      {record.testResults && record.testResults.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700 block mb-2">Attached Files:</span>
                          <div className="space-y-2">
                            {record.testResults.map((test: any) => test.fileUrl && (
                              <a
                                key={test.id}
                                href={test.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                              >
                                <File className="h-5 w-5 text-indigo-600" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{test.testName || 'Medical Document'}</p>
                                  <p className="text-xs text-gray-500">{new Date(test.testDate).toLocaleDateString()}</p>
                                </div>
                                <Download className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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


