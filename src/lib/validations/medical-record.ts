import { z } from 'zod'

export const createMedicalRecordSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  appointmentId: z.string().uuid().optional(),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  symptoms: z.string().min(1, 'Symptoms are required'),
  notes: z.string().optional(),
})

export const updateMedicalRecordSchema = z.object({
  diagnosis: z.string().optional(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>


