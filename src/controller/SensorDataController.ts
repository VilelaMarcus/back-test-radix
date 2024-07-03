import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const receiveSensorData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { equipmentId, timestamp, value } = req.body;

    const measurement = await prisma.measurement.create({
      data: {
        value: parseFloat(value),
        timestamp: new Date(timestamp),
        equipmentId: equipmentId
      }
    });

    res.status(201).json({ message: 'Dados do sensor recebidos e armazenados com sucesso', measurement });
  } catch (error) {
    next(error);
  }
};