import { PrismaClient } from '@prisma/client'

// Prevent multiple PrismaClient instances in development hot-reload cycles.
// In production the module is loaded once; the global guard is a no-op.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
