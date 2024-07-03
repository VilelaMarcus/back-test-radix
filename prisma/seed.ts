import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create equipment data
  const equipment1 = await prisma.equipment.create({
    data: {
      id: 'EQ-001',
      name: 'Drill',
      description: 'Drilling equipment',
    },
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      id: 'EQ-002',
      name: 'Pump',
      description: 'Pumping equipment',
    },
  });

  // Create user data
  await prisma.user.createMany({
    data: [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
    ],
  });

  // Create measurement data
  await prisma.measurement.createMany({
    data: [
      { value: 100.5, timestamp: new Date(), equipmentId: equipment1.id },
      { value: 150.2, timestamp: new Date(), equipmentId: equipment2.id },
    ],
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });