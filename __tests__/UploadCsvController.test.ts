import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { Prisma, PrismaClient } from '@prisma/client';
import app from '../src/index';
import prisma from '../src/utils/prismaClient';

jest.mock('../src/utils/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Upload CSV Controller', () => {
    beforeEach(() => {
        mockReset(prismaMock);
    });

    afterAll(async () => {
        await prismaMock.$disconnect();
        jest.restoreAllMocks(); // Limpa todos os mocks depois de todos os testes
    });

    it('should upload and process CSV data', async () => {
        const mockCsvData = `equipmentId,timestamp,value
    EQ-126789,2023-02-12T06:30:00.000Z:00:00,00.0
    EQ-12345,2023-01-12T01:30:00.000-05:00,89.9`;

    // Caminho completo para mock.csv
    const csvFilePath = path.resolve(__dirname, 'mock.csv');
    
    // Mock para fs.createReadStream e parse
    const mockReadStream = fs.createReadStream(csvFilePath);
    jest.spyOn(fs, 'createReadStream').mockReturnValueOnce(mockReadStream as any);

    // Mock para prisma.equipment.findUnique e create
    prismaMock.equipment.findUnique.mockResolvedValueOnce(null); // Simula equipamento não encontrado
    prismaMock.equipment.create.mockResolvedValueOnce({ id: 'EQ-126789', name: 'Equipment EQ-126789', description: null }); // Simula criação de equipamento
    prismaMock.equipment.create.mockResolvedValueOnce({ id: 'EQ-12345', name: 'Equipment EQ-12345', description: null }); // Simula criação de outro equipamento

    // Mock para prisma.measurement.create
    prismaMock.measurement.create.mockResolvedValueOnce({ id: 1, equipmentId: 'EQ-126789', timestamp: new Date('2023-02-12T06:30:00.000Z:00:00'), value: 0 });
    prismaMock.measurement.create.mockResolvedValueOnce({ id: 2, equipmentId: 'EQ-12345', timestamp: new Date('2023-01-12T01:30:00.000-05:00'), value: 89.9 });

    // Chama o endpoint POST /upload-csv
    const response = await request(app)
        .post('/api/upload-csv')
        .attach('csvFile', Buffer.from(mockCsvData), 'mock.csv');

    // Verifica se a resposta é bem-sucedida (status 201)
    expect(response.status).toBe(201);

    // Verifica se a resposta contém a mensagem esperada
    expect(response.body.message).toBe('Dados do CSV processados e armazenados com sucesso');

    // Verifica se os dados de medição estão corretos
    expect(response.body.measurements.length).toBe(2); // Agora esperamos dois registros de medição
    expect(response.body.measurements[0].equipmentId).toBe('EQ-126789');
    expect(response.body.measurements[0].timestamp).toBe('2023-02-12T06:30:00.000Z:00');
    expect(response.body.measurements[0].value).toBe(0);

    expect(response.body.measurements[1].equipmentId).toBe('EQ-12345');
    expect(response.body.measurements[1].timestamp).toBe('2023-01-12T01:30:00.000-05:00');
    expect(response.body.measurements[1].value).toBe(89.9);

    // Verifica se os métodos do Prisma foram chamados corretamente
    expect(prismaMock.equipment.findUnique).toHaveBeenCalledTimes(2);
    expect(prismaMock.equipment.create).toHaveBeenCalledTimes(2);
    expect(prismaMock.measurement.create).toHaveBeenCalledTimes(2);
    });
});