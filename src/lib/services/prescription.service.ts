import { prisma } from '@/lib/prisma'
import { CreatePrescriptionInput, UpdatePrescriptionInput } from '@/lib/validations/prescription'
import { Role } from '@prisma/client'

export class PrescriptionService {
  async createPrescription(doctorId: string, data: CreatePrescriptionInput) {
    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        doctorId,
        medicalRecordId: data.medicalRecordId,
        medication: data.medication,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        instructions: data.instructions,
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    })

    return prescription
  }

  async getPrescriptionsByPatient(patientId: string) {
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return prescriptions
  }

  async getPrescriptionsByDoctor(doctorId: string) {
    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return prescriptions
  }

  async getPrescriptionById(prescriptionId: string, userId: string, userRole: Role) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: true,
        doctor: true,
      },
    })

    if (!prescription) {
      throw new Error('Prescription not found')
    }

    if (userRole === Role.PATIENT && prescription.patientId !== userId) {
      throw new Error('Unauthorized access')
    }

    if (userRole === Role.DOCTOR && prescription.doctorId !== userId) {
      throw new Error('Unauthorized access')
    }

    return prescription
  }

  async updatePrescription(
    prescriptionId: string,
    doctorId: string,
    data: UpdatePrescriptionInput
  ) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
    })

    if (!prescription) {
      throw new Error('Prescription not found')
    }

    if (prescription.doctorId !== doctorId) {
      throw new Error('Unauthorized access')
    }

    const updated = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        ...(data.medication && { medication: data.medication }),
        ...(data.dosage && { dosage: data.dosage }),
        ...(data.frequency && { frequency: data.frequency }),
        ...(data.duration && { duration: data.duration }),
        ...(data.instructions !== undefined && { instructions: data.instructions }),
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    })

    return updated
  }

  async deletePrescription(prescriptionId: string, doctorId: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
    })

    if (!prescription) {
      throw new Error('Prescription not found')
    }

    if (prescription.doctorId !== doctorId) {
      throw new Error('Unauthorized access')
    }

    await prisma.prescription.delete({
      where: { id: prescriptionId },
    })

    return { success: true }
  }
}

export const prescriptionService = new PrescriptionService()


