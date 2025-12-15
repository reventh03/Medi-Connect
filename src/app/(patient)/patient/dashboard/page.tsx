import { getSession } from '@/lib/utils/session'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function PatientDashboard() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const patient = await prisma.patient.findUnique({
    where: { id: session.profileId },
  })

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      patientId: session.profileId,
      appointmentDate: {
        gte: new Date(),
      },
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          specialization: true,
        },
      },
    },
    take: 5,
    orderBy: {
      appointmentDate: 'asc',
    },
  })

  const recentPrescriptions = await prisma.prescription.findMany({
    where: {
      patientId: session.profileId,
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {patient?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your health records and appointments
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/patient/appointments/book">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xl">📅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Appointments
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {upcomingAppointments.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-md bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xl">💊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Prescriptions
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {recentPrescriptions.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-md bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Blood Group
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {patient?.bloodGroup || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Link
              href="/patient/appointments"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-l-4 border-indigo-500 pl-4 py-2"
                >
                  <p className="font-medium text-gray-900">
                    Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointment.doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                    {appointment.appointmentTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Prescriptions
            </h2>
            <Link
              href="/patient/prescriptions"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          {recentPrescriptions.length === 0 ? (
            <p className="text-gray-500 text-sm">No prescriptions</p>
          ) : (
            <div className="space-y-4">
              {recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <p className="font-medium text-gray-900">
                    {prescription.medication}
                  </p>
                  <p className="text-sm text-gray-600">
                    {prescription.dosage} - {prescription.frequency}
                  </p>
                  <p className="text-sm text-gray-500">
                    Prescribed by Dr. {prescription.doctor.firstName}{' '}
                    {prescription.doctor.lastName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

