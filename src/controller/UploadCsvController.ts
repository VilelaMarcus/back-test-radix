import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import fs from 'fs';

const prisma = new PrismaClient();

export const uploadCsvController = async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo CSV enviado.');
  }

  try {
    const csvFile = req.file;
    const parser = fs.createReadStream(csvFile.path).pipe(parse({ delimiter: ',', from_line: 2 })); // Ignora a primeira linha
    let measurements = [];

    for await (const record of parser) {
        const [equipmentId, timestamp, value] = record;        
        
        let equipment = await prisma.equipment.findUnique({
          where: { id: equipmentId },
        });

        if (!equipment) {
          equipment = await prisma.equipment.create({
            data: {
              id: equipmentId,
              name: `Equipment ${equipmentId}`,
              description: `Description - ${equipmentId}`,
            },
          });
        }
          
        // Validar e converter timestamp
        let dateTimestamp;
        try {
            dateTimestamp = new Date(timestamp);
            if (isNaN(dateTimestamp.getTime())) {
            throw new Error('Invalid timestamp format.');
            }
        } catch (error) {
            console.error(`Invalid timestamp: ${timestamp}`);
            continue; // Skip this record or handle the error
        }

        // Validar e converter valor
        let numericValue;
        try {
            numericValue = parseFloat(value);
            if (isNaN(numericValue)) {
            throw new Error('Invalid value format.');
            }
        } catch (error) {
            console.error(`Invalid value: ${value}`);
            continue;
        }

        try {
            const measurement = await prisma.measurement.create({
            data: {
                equipmentId,
                timestamp: dateTimestamp,
                value: numericValue
            }
            });
            measurements.push(measurement);
        } catch (error: any) {
            console.error(`Erro ao salvar a medição no banco de dados: ${error.message}`);
            continue; // Skip this record or handle the error
        }
    }

    fs.unlinkSync(csvFile.path);
    res.status(201).json({ message: 'Dados do CSV processados e armazenados com sucesso', measurements });
  } catch (error) {
    console.error('Erro ao processar o arquivo CSV:', error);
    res.status(500).send('Erro ao processar o arquivo CSV.');
  }
};