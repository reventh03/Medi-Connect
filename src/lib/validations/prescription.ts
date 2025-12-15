import { z } from 'zod'

export const createPrescriptionSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  medicalRecordId: z.string().uuid().optional(),
  medication: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
})

export const updatePrescriptionSchema = z.object({
  medication: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
})

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>


