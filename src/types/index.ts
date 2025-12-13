import { Role } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  role: Role
  profileId: string
  firstName: string
  lastName: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: Role
  firstName: string
  lastName: string
  dateOfBirth?: Date
  phone: string
  address?: string
  bloodGroup?: string
  specialization?: string
  licenseNumber?: string
  department?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}


