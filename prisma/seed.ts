import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 10; i++) {
    await prisma.equipment.create({
      data: {
        id: `EQ-00${i}`,
        name: `Equipment ${i}`,
        description: `Equipment ${i}`, // Add a description property
      },
    });
  }

  // Create user data (if needed)
  await prisma.user.createMany({
    data: [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
    ],
  });

  // Create measurement data
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1); // 1 month ago

  const measurementData: { value: number; timestamp: Date; equipmentId: string; }[] = [];
  for (let i = 0; i < 30; i++) {
    const randomEquipmentId = Math.floor(Math.random() * 10) + 1; // Random equipment ID between 1 and 10
    const randomTimestamp = new Date(startDate);
    randomTimestamp.setDate(randomTimestamp.getDate() + i); // Increment days

    measurementData.push({
      value: Math.random() * 1000, // Random value
      timestamp: randomTimestamp,
      equipmentId: `EQ-00${randomEquipmentId}`, // Adjust based on your equipment IDs
    });
  }

  await prisma.measurement.createMany({
    data: measurementData,
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });