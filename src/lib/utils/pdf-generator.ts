'use client'

import jsPDF from 'jspdf'

interface MedicalRecord {
  id: string
  diagnosis: string
  symptoms: string
  notes: string | null
  createdAt: string | Date
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string | null
  createdAt: string | Date
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
}

export function downloadMedicalRecordPDF(record: MedicalRecord, patientName: string) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Medical Record', 105, 20, { align: 'center' })
  
  // Patient Info
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Patient: ${patientName}`, 20, 40)
  doc.text(`Date: ${new Date(record.createdAt).toLocaleDateString()}`, 20, 47)
  
  // Doctor Info
  doc.text(`Doctor: Dr. ${record.doctor.firstName} ${record.doctor.lastName}`, 20, 54)
  doc.text(`Specialization: ${record.doctor.specialization}`, 20, 61)
  
  // Line separator
  doc.line(20, 68, 190, 68)
  
  // Diagnosis
  doc.setFont('helvetica', 'bold')
  doc.text('Diagnosis:', 20, 78)
  doc.setFont('helvetica', 'normal')
  const diagnosisLines = doc.splitTextToSize(record.diagnosis, 170)
  doc.text(diagnosisLines, 20, 85)
  
  let yPos = 85 + (diagnosisLines.length * 7)
  
  // Symptoms
  doc.setFont('helvetica', 'bold')
  doc.text('Symptoms:', 20, yPos + 10)
  doc.setFont('helvetica', 'normal')
  const symptomsLines = doc.splitTextToSize(record.symptoms, 170)
  doc.text(symptomsLines, 20, yPos + 17)
  
  yPos = yPos + 17 + (symptomsLines.length * 7)
  
  // Notes
  if (record.notes) {
    doc.setFont('helvetica', 'bold')
    doc.text('Treatment Notes:', 20, yPos + 10)
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(record.notes, 170)
    doc.text(notesLines, 20, yPos + 17)
  }
  
  // Footer
  doc.setFontSize(10)
  doc.setTextColor(128, 128, 128)
  doc.text('MediConnect - Healthcare Management System', 105, 280, { align: 'center' })
  
  // Save
  doc.save(`medical-record-${new Date(record.createdAt).toLocaleDateString()}.pdf`)
}

export function downloadPrescriptionPDF(prescription: Prescription, patientName: string) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Prescription', 105, 20, { align: 'center' })
  
  // Patient Info
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Patient: ${patientName}`, 20, 40)
  doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 20, 47)
  
  // Doctor Info
  doc.text(`Prescribed by: Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}`, 20, 54)
  doc.text(`Specialization: ${prescription.doctor.specialization}`, 20, 61)
  
  // Line separator
  doc.line(20, 68, 190, 68)
  
  // Prescription Box
  doc.setDrawColor(59, 130, 246) // Blue border
  doc.setFillColor(239, 246, 255) // Light blue background
  doc.roundedRect(20, 75, 170, 60, 3, 3, 'FD')
  
  // Medication
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(prescription.medication, 25, 85)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Dosage: ${prescription.dosage}`, 25, 95)
  doc.text(`Frequency: ${prescription.frequency}`, 25, 102)
  doc.text(`Duration: ${prescription.duration}`, 25, 109)
  
  // Instructions
  if (prescription.instructions) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Instructions:', 20, 150)
    doc.setFont('helvetica', 'normal')
    const instructionsLines = doc.splitTextToSize(prescription.instructions, 170)
    doc.text(instructionsLines, 20, 157)
  }
  
  // Footer
  doc.setFontSize(10)
  doc.setTextColor(128, 128, 128)
  doc.text('MediConnect - Healthcare Management System', 105, 280, { align: 'center' })
  
  // Save
  doc.save(`prescription-${prescription.medication}-${new Date(prescription.createdAt).toLocaleDateString()}.pdf`)
}

