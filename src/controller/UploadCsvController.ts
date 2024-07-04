import multer from 'multer';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import upload from '../utils/multerConfig';

const prisma = new PrismaClient();

export const uploadCsv = async (req: Request, res: Response) => {
  upload.single('csvFile')(req, res, async function (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send('Erro ao fazer upload do arquivo.');
    } else if (err) {
      return res.status(500).send(err.message);
    }

    if (!req.file) {
      return res.status(400).send('Nenhum arquivo CSV enviado.');
    }

    try {
      const csvFile = req.file;
      const debuggerFilePath = path.join(__dirname, '../../debugger.csv');
      fs.copyFileSync(csvFile.path, debuggerFilePath);
      console.log(`Arquivo CSV salvo como debugger.csv na raiz do projeto.`);

      const parser = fs.createReadStream(csvFile.path).pipe(parse({ delimiter: ',' }));
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
    } catch (error) {
      console.error('Erro ao processar o arquivo CSV:', error);
      res.status(500).send('Erro ao processar o arquivo CSV.');
    }
  });
};