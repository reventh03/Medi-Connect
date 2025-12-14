import { prisma } from '@/lib/prisma'
import { CreateMedicalRecordInput, UpdateMedicalRecordInput } from '@/lib/validations/medical-record'
import { Role } from '@prisma/client'

export class MedicalRecordService {
  async createMedicalRecord(doctorId: string, data: CreateMedicalRecordInput) {
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: data.patientId,
        doctorId,
        appointmentId: data.appointmentId,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        notes: data.notes,
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

    return medicalRecord
  }

  async getMedicalRecordsByPatient(patientId: string) {
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        appointment: {
          select: {
            appointmentDate: true,
          },
        },
        testResults: {
          select: {
            id: true,
            testName: true,
            testDate: true,
            fileUrl: true,
            resultValue: true,
            notes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return records
  }

  async getMedicalRecordsByDoctor(doctorId: string) {
    const records = await prisma.medicalRecord.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            dateOfBirth: true,
          },
        },
        testResults: {
          select: {
            id: true,
            testName: true,
            testDate: true,
            fileUrl: true,
            resultValue: true,
            notes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return records
  }

  async getMedicalRecordById(recordId: string, userId: string, userRole: Role) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
        prescriptions: true,
        testResults: true,
      },
    })

    if (!record) {
      throw new Error('Medical record not found')
    }

    if (userRole === Role.PATIENT && record.patientId !== userId) {
      throw new Error('Unauthorized access')
    }

    if (userRole === Role.DOCTOR && record.doctorId !== userId) {
      throw new Error('Unauthorized access')
    }

    return record
  }

  async updateMedicalRecord(
    recordId: string,
    doctorId: string,
    data: UpdateMedicalRecordInput
  ) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
    })

    if (!record) {
      throw new Error('Medical record not found')
    }

    if (record.doctorId !== doctorId) {
      throw new Error('Unauthorized access')
    }

    const updated = await prisma.medicalRecord.update({
      where: { id: recordId },
      data: {
        ...(data.diagnosis && { diagnosis: data.diagnosis }),
        ...(data.symptoms && { symptoms: data.symptoms }),
        ...(data.notes !== undefined && { notes: data.notes }),
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

  async deleteMedicalRecord(recordId: string, doctorId: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
    })

    if (!record) {
      throw new Error('Medical record not found')
    }

    if (record.doctorId !== doctorId) {
      throw new Error('Unauthorized access')
    }

    await prisma.medicalRecord.delete({
      where: { id: recordId },
    })

    return { success: true }
  }
}

export const medicalRecordService = new MedicalRecordService()


