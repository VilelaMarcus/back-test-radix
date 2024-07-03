import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import csvParse from 'csv-parse';
import fs from 'fs';
import upload from '../utils/multerConfig'; // Importa o middleware multer configurado
import multer from 'multer';

const prisma = new PrismaClient();

export const uploadCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    upload.single('csvFile')(req, res, async function (err: any) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('Erro ao fazer upload do arquivo.');
      } else if (err) {
        return res.status(500).send(err);
      }

      if (!req.file) {
        return res.status(400).send('Nenhum arquivo CSV enviado.');
      }

      const csvFile = req.file;

      const parser = fs.createReadStream(csvFile.path).pipe(csvParse({ delimiter: ',' }));

      let measurements = [];
      for await (const record of parser) {
        const [equipmentId, timestamp, value] = record;

        const measurement = await prisma.measurement.create({
          data: {
            value: parseFloat(value),
            timestamp: new Date(timestamp),
            equipmentId: equipmentId
          }
        });

        measurements.push(measurement);
      }

      fs.unlinkSync(csvFile.path);

      res.status(201).json({ message: 'Dados do CSV processados e armazenados com sucesso', measurements });
    });
  } catch (error) {
    next(error);
  }
};