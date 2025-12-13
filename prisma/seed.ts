import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  const patientPassword = await bcrypt.hash('Patient@123', 10)
  const doctorPassword = await bcrypt.hash('Doctor@123', 10)

  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@demo.com',
      passwordHash: patientPassword,
      role: Role.PATIENT,
      patient: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-05-15'),
          phone: '+1234567890',
          address: '123 Main Street, New York, NY 10001',
          bloodGroup: 'O+',
        },
      },
    },
  })

  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@demo.com',
      passwordHash: doctorPassword,
      role: Role.DOCTOR,
      doctor: {
        create: {
          firstName: 'Sarah',
          lastName: 'Smith',
          specialization: 'General Practitioner',
          licenseNumber: 'MD-12345',
          phone: '+1987654321',
          department: 'General Medicine',
        },
      },
    },
  })

  const patient2User = await prisma.user.create({
    data: {
      email: 'jane@demo.com',
      passwordHash: patientPassword,
      role: Role.PATIENT,
      patient: {
        create: {
          firstName: 'Jane',
          lastName: 'Wilson',
          dateOfBirth: new Date('1985-08-22'),
          phone: '+1122334455',
          address: '456 Oak Avenue, Los Angeles, CA 90001',
          bloodGroup: 'A+',
        },
      },
    },
  })

  const doctor2User = await prisma.user.create({
    data: {
      email: 'drjones@demo.com',
      passwordHash: doctorPassword,
      role: Role.DOCTOR,
      doctor: {
        create: {
          firstName: 'Michael',
          lastName: 'Jones',
          specialization: 'Cardiologist',
          licenseNumber: 'MD-67890',
          phone: '+1555666777',
          department: 'Cardiology',
        },
      },
    },
  })

  console.log('Created users:')
  console.log('- Patient: patient@demo.com (Password: Patient@123)')
  console.log('- Doctor: doctor@demo.com (Password: Doctor@123)')
  console.log('- Patient: jane@demo.com (Password: Patient@123)')
  console.log('- Doctor: drjones@demo.com (Password: Doctor@123)')

  const patient = await prisma.patient.findUnique({
    where: { userId: patientUser.id },
  })

  const doctor = await prisma.doctor.findUnique({
    where: { userId: doctorUser.id },
  })

  if (patient && doctor) {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: new Date('2024-12-15'),
        appointmentTime: '10:00 AM',
        status: 'SCHEDULED',
        reason: 'Regular checkup',
        notes: 'Annual physical examination',
      },
    })

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentId: appointment.id,
        diagnosis: 'Healthy',
        symptoms: 'No symptoms reported',
        notes: 'Patient is in good health. Recommended annual checkup.',
      },
    })

    await prisma.prescription.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        medicalRecordId: medicalRecord.id,
        medication: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take with food in the morning',
      },
    })

    await prisma.testResult.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        medicalRecordId: medicalRecord.id,
        testName: 'Complete Blood Count (CBC)',
        testDate: new Date('2024-12-10'),
        resultValue: 'Normal',
        notes: 'All values within normal range',
      },
    })

    console.log('\nCreated sample data:')
    console.log('- 1 Appointment')
    console.log('- 1 Medical Record')
    console.log('- 1 Prescription')
    console.log('- 1 Test Result')
  }

  console.log('\nDatabase seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


