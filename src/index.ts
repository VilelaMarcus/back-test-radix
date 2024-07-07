import express from 'express';
import cors from 'cors';
import sensorRouter from './routes/SensorRouter';
import csvRouter from './routes/CsvRouter';
import prisma from './utils/prismaClient';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configuração das rotas
app.use('/api', sensorRouter);
app.use('/api', csvRouter);

let server: any; // Variável para armazenar o servidor Express

export async function bootstrap() {
  await prisma.initPrisma(); // Inicializa o Prisma

  const port = 3005;
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return server; // Retorna o servidor para ser acessível fora da função
}

export async function closeServer() {
  if (server) {
    await server.close(); // Fecha o servidor Express
    await prisma.disconnect(); // Desconecta o Prisma
    console.log('Server closed');
  }
}

// Iniciar o servidor se este arquivo for executado diretamente
if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;