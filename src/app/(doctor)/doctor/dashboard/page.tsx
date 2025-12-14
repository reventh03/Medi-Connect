import { getSession } from '@/lib/utils/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DoctorDashboardClient from './DoctorDashboardClient'

export default async function DoctorDashboard() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const doctor = await prisma.doctor.findUnique({
    where: { id: session.profileId },
  })

  const todayAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: session.profileId,
      appointmentDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
    orderBy: {
      appointmentTime: 'asc',
    },
  })

  const uniquePatients = await prisma.medicalRecord.findMany({
    where: {
      doctorId: session.profileId,
    },
    select: {
      patientId: true,
    },
    distinct: ['patientId'],
  })
  
  const totalPatients = uniquePatients.length

  const recentRecords = await prisma.medicalRecord.findMany({
    where: {
      doctorId: session.profileId,
    },
    include: {
      patient: {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, Dr. {doctor?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          {doctor?.specialization} - {doctor?.department}
        </p>
      </div>

      <DoctorDashboardClient />

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
                    Today's Appointments
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {todayAppointments.length}
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
                  <span className="text-white text-xl">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Patients
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {totalPatients}
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
                    License Number
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {doctor?.licenseNumber}
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
              Today&apos;s Appointments
            </h2>
            <Link
              href="/doctor/appointments"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments today</p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-l-4 border-indigo-500 pl-4 py-2"
                >
                  <p className="font-medium text-gray-900">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                  <p className="text-sm text-gray-500">
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
              Recent Medical Records
            </h2>
            <Link
              href="/doctor/medical-records"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          {recentRecords.length === 0 ? (
            <p className="text-gray-500 text-sm">No medical records</p>
          ) : (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <p className="font-medium text-gray-900">
                    {record.patient.firstName} {record.patient.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{record.diagnosis}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.createdAt).toLocaleDateString()}
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

