'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, ArrowLeft, Upload, X, Download, File } from 'lucide-react'
import Link from 'next/link'

interface TestResult {
  id: string
  testName: string
  testDate: string
  fileUrl: string | null
  resultValue: string
  notes: string | null
}

export default function EditMedicalRecordPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    notes: '',
  })
  const [patientName, setPatientName] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [existingFiles, setExistingFiles] = useState<TestResult[]>([])
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])

  useEffect(() => {
    fetchRecord()
  }, [])

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/medical-records/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData({
          diagnosis: data.data.diagnosis,
          symptoms: data.data.symptoms,
          notes: data.data.notes || '',
        })
        setPatientName(`${data.data.patient.firstName} ${data.data.patient.lastName}`)
        
        // Load existing test results/files
        if (data.data.testResults) {
          setExistingFiles(data.data.testResults)
        }
      } else {
        setError(data.error || 'Failed to fetch record')
      }
    } catch (err) {
      setError('Failed to load record')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/medical-records/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to update medical record')
        setLoading(false)
        return
      }

      router.push('/doctor/medical-records')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFilesToDelete([...filesToDelete, fileId])
    setExistingFiles(existingFiles.filter(f => f.id !== fileId))
  }

  if (fetchLoading) {
    return (
      <div className="px-4 py-6 sm:px-0 max-w-3xl mx-auto">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/doctor/medical-records"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medical Records
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Medical Record</h1>
        <p className="mt-2 text-gray-600">Update patient medical information</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Medical Record for {patientName}</CardTitle>
              <CardDescription>Update diagnosis, symptoms, and treatment notes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                type="text"
                required
                value={formData.diagnosis}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms *</Label>
              <textarea
                id="symptoms"
                name="symptoms"
                required
                rows={4}
                value={formData.symptoms}
                onChange={handleChange}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Treatment Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                value={formData.notes}
                onChange={handleChange}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Existing Files Section */}
            {existingFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Files</Label>
                <div className="space-y-2">
                  {existingFiles.map((file) => file.fileUrl && (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.testName || 'Medical Document'}</p>
                          <p className="text-xs text-gray-500">{new Date(file.testDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Download className="h-4 w-4 text-gray-600" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New File Section */}
            <div className="space-y-2">
              <Label>Upload New File (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadedFile ? (
                      <>
                        <FileText className="w-10 h-10 mb-3 text-green-600" />
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">{uploadedFile.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG, DICOM (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.dicom"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {uploadedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove New File
                </Button>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Note: File upload will be simulated. In production, files would be uploaded to cloud storage.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Medical Record'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


