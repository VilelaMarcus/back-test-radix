import request from 'supertest';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

jest.mock('../src/utils/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

import app from '../src/index'; 
import prisma from '../src/utils/prismaClient';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Sensor Data Controller', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it('should receive sensor data and store it in the database', async () => {
    prismaMock.measurement.create.mockResolvedValue({
      id: 2,
      equipmentId: 'EQ-001',
      timestamp: new Date(),
      value: 25.5,
    });

    const res = await request(app)
      .post('/api/sensor-data')
      .send({
        equipmentId: 'EQ-001',
        timestamp: new Date().toISOString(),
        value: 25.5,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Dados do sensor recebidos e armazenados com sucesso');
    expect(res.body.measurement).toBeDefined();
  });

  it('should create a new equipment if it does not exist', async () => {
    prismaMock.equipment.findUnique.mockResolvedValue(null);
    prismaMock.equipment.create.mockResolvedValue({
      id: 'EQ-002',
      name: 'New Equipment',
      description: null,
    });
    prismaMock.measurement.create.mockResolvedValue({
      id: 1,
      equipmentId: 'EQ-002',
      timestamp: new Date(),
      value: 30.0,
    });

    const res = await request(app)
      .post('/api/sensor-data')
      .send({
        equipmentId: 'EQ-002',
        timestamp: new Date().toISOString(),
        value: 30.0,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Dados do sensor recebidos e armazenados com sucesso');
    expect(res.body.measurement).toBeDefined();
  });
});