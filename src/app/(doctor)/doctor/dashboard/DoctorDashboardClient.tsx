'use client'

import { useState } from 'react'
import { UserPlus, Stethoscope } from 'lucide-react'
import AddPatientModal from '@/components/AddPatientModal'
import AddDoctorModal from '@/components/AddDoctorModal'

export default function DoctorDashboardClient() {
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showAddDoctor, setShowAddDoctor] = useState(false)

  const handlePatientSuccess = () => {
    // Refresh the page to show updated data
    window.location.reload()
  }

  const handleDoctorSuccess = () => {
    // Refresh the page to show updated data
    window.location.reload()
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setShowAddPatient(true)}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-4 group"
        >
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">Add New Patient</h3>
            <p className="text-sm text-indigo-100 mt-1">
              Register a new patient to the system
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowAddDoctor(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-4 group"
        >
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">Add New Doctor</h3>
            <p className="text-sm text-green-100 mt-1">
              Register a new doctor to the system
            </p>
          </div>
        </button>
      </div>

      <AddPatientModal
        isOpen={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        onSuccess={handlePatientSuccess}
      />

      <AddDoctorModal
        isOpen={showAddDoctor}
        onClose={() => setShowAddDoctor(false)}
        onSuccess={handleDoctorSuccess}
      />
    </>
  )
}

