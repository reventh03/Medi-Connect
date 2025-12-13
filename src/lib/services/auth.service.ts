import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '@/lib/utils/auth'
import { LoginInput, RegisterPatientInput, RegisterDoctorInput } from '@/lib/validations/auth'
import { CreatePatientByAdminInput, CreateDoctorByAdminInput, ChangePasswordInput } from '@/lib/validations/admin'
import { generateSecurePassword } from '@/lib/utils/password'
import { Role } from '@prisma/client'
import { AuthUser } from '@/types'

export class AuthService {
  async login(credentials: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      include: {
        patient: true,
        doctor: true,
      },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isValidPassword = await verifyPassword(
      credentials.password,
      user.passwordHash
    )

    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    const profile = user.role === Role.PATIENT ? user.patient : user.doctor

    if (!profile) {
      throw new Error('User profile not found')
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      profileId: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
    }

    const token = generateToken(authUser)

    return { user: authUser, token }
  }

  async registerPatient(data: RegisterPatientInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: Role.PATIENT,
        patient: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: new Date(data.dateOfBirth),
            phone: data.phone,
            address: data.address,
            bloodGroup: data.bloodGroup,
          },
        },
      },
      include: {
        patient: true,
      },
    })

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      profileId: user.patient!.id,
      firstName: user.patient!.firstName,
      lastName: user.patient!.lastName,
    }

    const token = generateToken(authUser)

    return { user: authUser, token }
  }

  async registerDoctor(data: RegisterDoctorInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const existingLicense = await prisma.doctor.findUnique({
      where: { licenseNumber: data.licenseNumber },
    })

    if (existingLicense) {
      throw new Error('License number already registered')
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: Role.DOCTOR,
        doctor: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            specialization: data.specialization,
            licenseNumber: data.licenseNumber,
            phone: data.phone,
            department: data.department,
          },
        },
      },
      include: {
        doctor: true,
      },
    })

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      profileId: user.doctor!.id,
      firstName: user.doctor!.firstName,
      lastName: user.doctor!.lastName,
    }

    const token = generateToken(authUser)

    return { user: authUser, token }
  }

  async createPatientByDoctor(data: CreatePatientByAdminInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const generatedPassword = generateSecurePassword()
    const passwordHash = await hashPassword(generatedPassword)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: Role.PATIENT,
        patient: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: new Date(data.dateOfBirth),
            phone: data.phone,
            address: data.address,
            bloodGroup: data.bloodGroup,
          },
        },
      },
      include: {
        patient: true,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.patient!.firstName,
        lastName: user.patient!.lastName,
      },
      password: generatedPassword,
    }
  }

  async createDoctorByDoctor(data: CreateDoctorByAdminInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const existingLicense = await prisma.doctor.findUnique({
      where: { licenseNumber: data.licenseNumber },
    })

    if (existingLicense) {
      throw new Error('License number already registered')
    }

    const generatedPassword = generateSecurePassword()
    const passwordHash = await hashPassword(generatedPassword)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: Role.DOCTOR,
        doctor: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            specialization: data.specialization,
            licenseNumber: data.licenseNumber,
            phone: data.phone,
            department: data.department,
          },
        },
      },
      include: {
        doctor: true,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.doctor!.firstName,
        lastName: user.doctor!.lastName,
      },
      password: generatedPassword,
    }
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await verifyPassword(
      data.currentPassword,
      user.passwordHash
    )

    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    const newPasswordHash = await hashPassword(data.newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    })

    return { success: true }
  }
}

export const authService = new AuthService()


