import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Controlador para obter valor médio dos sensores
export const getSensorAverage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeframe } = req.query;
    let startDate: Date;

    switch (timeframe) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '48h':
        startDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
        break;
      case '1w':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ error: 'Parâmetro de timeframe inválido. Use 24h, 48h, 1w ou 1m.' });
    }

    // const averageMeasurements = await prisma.$queryRaw<Prisma.Decimal>('SELECT equipmentId, AVG(value) AS averageValue FROM Measurement WHERE timestamp >= $1 GROUP BY equipmentId ORDER BY equipmentId', startDate);

    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};