import { getSession } from '@/lib/utils/session'
import { prescriptionService } from '@/lib/services/prescription.service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/DeleteButton'
import { Pill, User, Calendar, Plus, Edit } from 'lucide-react'
import Link from 'next/link'

export default async function DoctorPrescriptionsPage() {
  const session = await getSession()
  if (!session) return null

  const prescriptions = await prescriptionService.getPrescriptionsByDoctor(session.profileId)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="mt-2 text-gray-600">View all prescriptions you've created</p>
        </div>
        <Button asChild>
          <Link href="/doctor/prescriptions/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Prescription
          </Link>
        </Button>
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
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {prescription.patient.firstName} {prescription.patient.lastName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        >
                          <Link href={`/doctor/prescriptions/${prescription.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteButton
                          id={prescription.id}
                          endpoint="/api/prescriptions"
                          itemName="prescription"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {prescription.medication}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Dosage:</span>
                          <p className="text-gray-600">{prescription.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Frequency:</span>
                          <p className="text-gray-600">{prescription.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Duration:</span>
                          <p className="text-gray-600">{prescription.duration}</p>
                        </div>
                      </div>

                      {prescription.instructions && (
                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Instructions:</span>
                          <p className="mt-1 text-sm text-gray-600">{prescription.instructions}</p>
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

