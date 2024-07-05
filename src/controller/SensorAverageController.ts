import { PrismaClient, Prisma } from '@prisma/client';

import { HttpError } from '../utils/errors';
import { ApiHandler } from '../utils/types';

const prisma = new PrismaClient();

// Controlador para obter valor médio dos sensores
export const getSensorAverage: ApiHandler = async ({ request, response }): Promise<void> => {
    const { timeframe, sensor } = request.query;
    console.log({timeframe, sensor });

    let startDate: Date;

    if (timeframe === null) {
      throw new HttpError(404, 'Not found');
    }

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
        response.status(400).json({ error: 'Parâmetro de timeframe inválido. Use 24h, 48h, 1w ou 1m.' });
        return;
    }
    
    console.log('Data de início:', startDate);
    console.log('Equipamento selecionado:', sensor);

    const averageMeasurements = await prisma.$queryRaw<String[]>`SELECT * FROM public."Measurement" WHERE "equipmentId" = ${sensor} AND timestamp >= ${startDate}`;
    console.log({averageMeasurements});
    console.log('Calculando média dos valores...');

    response.status(200).json(averageMeasurements);

};