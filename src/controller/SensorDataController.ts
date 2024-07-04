import { PrismaClient } from '@prisma/client';
import { ApiHandler } from '../utils/types';

const prisma = new PrismaClient();

export const receiveSensorData: ApiHandler = async ({ request, response }) => {
  console.log('Recebendo dados do sensor');
  console.log({ request });

  try {
    const { equipmentId, timestamp, value } = request.body;

    // Verifica se o equipamento existe
    let equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    // Se o equipamento não existir, cria um novo
    if (!equipment) {
      equipment = await prisma.equipment.create({
        data: {
          id: equipmentId,
          name: `Equipment ${equipmentId}`,
          description: `Description - ${equipmentId}`,
        },
      });
    }

    // Cria a medição
    const measurement = await prisma.measurement.create({
      data: {
        value: parseFloat(value),
        timestamp: new Date(timestamp),
        equipmentId: equipment.id,
      },
    });

    response.status(201).json({ message: 'Dados do sensor recebidos e armazenados com sucesso', measurement });
  } catch (error: any) {
    response.status(500).send(error.message);
  }
};