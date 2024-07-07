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

  afterAll(async () => {
    await prismaMock.$disconnect();
  });

  it('should retrieve all sensor data', async () => {

    // Chama o endpoint GET /sensor-data
    const response = await request(app).get('/api/sensor-data');

    expect(response.status).toBe(201);
  });
});