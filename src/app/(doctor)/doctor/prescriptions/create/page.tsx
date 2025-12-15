'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Pill, ArrowLeft, User, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  bloodGroup: string | null
  user: {
    email: string
  }
}

interface Medication {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function CreatePrescriptionPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patientId, setPatientId] = useState('')
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    },
  ])

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      const data = await response.json()
      
      if (data.success) {
        setPatients(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err)
    }
  }

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ])
  }

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id))
    }
  }

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      for (const medication of medications) {
        if (medication.medication && medication.dosage && medication.frequency && medication.duration) {
          const response = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId,
              ...medication,
            }),
          })

          const data = await response.json()

          if (!data.success) {
            setError(data.error || 'Failed to create prescription')
            setLoading(false)
            return
          }
        }
      }

      router.push('/doctor/prescriptions')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const selectedPatient = patients.find(p => p.id === patientId)

  return (
    <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/doctor/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prescriptions
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Prescription</h1>
        <p className="mt-2 text-gray-600">Prescribe medications for your patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Select the patient for this prescription</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Select Patient *</Label>
                <select
                  id="patientId"
                  name="patientId"
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  <option value="">Choose a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.user.email}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatient && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                      <p className="text-sm text-blue-700">{selectedPatient.user.email}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-blue-600">
                        <div>DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</div>
                        {selectedPatient.bloodGroup && <div>Blood: {selectedPatient.bloodGroup}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {medications.map((med, index) => (
          <Card key={med.id} className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Pill className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Medication #{index + 1}</CardTitle>
                    <CardDescription>Fill in the medication details</CardDescription>
                  </div>
                </div>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(med.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`medication-${med.id}`}>Medication Name *</Label>
                <Input
                  id={`medication-${med.id}`}
                  type="text"
                  required
                  placeholder="e.g., Amoxicillin, Ibuprofen, Metformin"
                  value={med.medication}
                  onChange={(e) => updateMedication(med.id, 'medication', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`dosage-${med.id}`}>Dosage *</Label>
                  <Input
                    id={`dosage-${med.id}`}
                    type="text"
                    required
                    placeholder="e.g., 500mg, 10ml"
                    value={med.dosage}
                    onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`frequency-${med.id}`}>Frequency *</Label>
                  <select
                    id={`frequency-${med.id}`}
                    required
                    value={med.frequency}
                    onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="Every 4 hours">Every 4 hours</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Before meals">Before meals</option>
                    <option value="After meals">After meals</option>
                    <option value="At bedtime">At bedtime</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`duration-${med.id}`}>Duration *</Label>
                <select
                  id={`duration-${med.id}`}
                  required
                  value={med.duration}
                  onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  <option value="">Select duration</option>
                  <option value="3 days">3 days</option>
                  <option value="5 days">5 days</option>
                  <option value="7 days">7 days</option>
                  <option value="10 days">10 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90 days">90 days</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`instructions-${med.id}`}>Special Instructions</Label>
                <textarea
                  id={`instructions-${med.id}`}
                  rows={3}
                  value={med.instructions}
                  onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                  placeholder="e.g., Take with food, Avoid alcohol..."
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addMedication}
          className="w-full border-dashed border-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Medication
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Upload Prescription Document (Optional)</CardTitle>
                <CardDescription>Upload scanned prescription or handwritten notes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
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
                  Remove File
                </Button>
              )}
            </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Creating...' : `Create ${medications.length} Prescription${medications.length > 1 ? 's' : ''}`}
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

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Important:</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Verify patient allergies before prescribing</li>
          <li>Check for drug interactions with current medications</li>
          <li>Patient will receive all prescriptions immediately</li>
          <li>Ensure all dosages and instructions are accurate</li>
        </ul>
      </div>
    </div>
  )
}
