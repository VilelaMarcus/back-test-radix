import { PrismaClient } from '@prisma/client';
import { ApiHandler } from '../utils/types';

const prisma = new PrismaClient();

export const retriveSensorData: ApiHandler = async ({ request, response }) => {
  const sesors = await prisma.equipment.findMany();

  response.status(201).json(sesors);
};