const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Logging untuk debugging
});

prisma.$connect()
  .then(() => console.log('Prisma connected to database'))
  .catch((err) => {
    console.error('Prisma failed to connect:', err);
    process.exit(1);
  });

module.exports = prisma;