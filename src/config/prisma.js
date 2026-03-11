const { PrismaClient } = require('@prisma/client');

// eslint-disable-next-line no-undef
const isProduction = process.env.NODE_ENV === 'production';
const prismaLog = isProduction ? ['warn', 'error'] : ['query', 'info', 'warn', 'error'];

// Reuse PrismaClient across hot reloads/serverless warm starts.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({ log: prismaLog });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
