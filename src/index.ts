import express, { Response } from 'express';
import cors from 'cors';
import sensorRouter from './routes/SensorRouter';
import csvRouter from './routes/CsvRouter';
import prisma from './utils/prismaClient';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

async function bootstrap() {  
  
  prisma.initPrisma();

  app.use('/api', sensorRouter);
  app.use('/api', csvRouter);


  const port = 3005;
  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
})
  .finally(async () => {
    await prisma.disconnect();
});

export default app;