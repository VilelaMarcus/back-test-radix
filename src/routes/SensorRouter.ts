import { Router } from 'express';
import { receiveSensorData } from '../controller/SensorDataController';
import { getSensorAverage } from '../controller/SensorAverageController';
import createRoute from '../middleware/create-route';

const sensorRouter = Router();

sensorRouter.post('/sensor-data', createRoute(receiveSensorData));
sensorRouter.get('/sensor-average', getSensorAverage);

// Rota de depuração
sensorRouter.get('/debug2', (req, res) => {
  res.send('worksasc');
});

export default sensorRouter;