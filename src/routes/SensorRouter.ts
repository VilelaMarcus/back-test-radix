import { Router } from 'express';
import { receiveSensorData } from '../controller/SensorDataController';
import { retriveSensorData } from '../controller/GetSensorDataController';
import { getSensorAverage } from '../controller/SensorAverageController';
import createRoute from '../middleware/create-route';

const sensorRouter = Router();

sensorRouter.post('/sensor-data', createRoute(receiveSensorData));
sensorRouter.get('/sensor-data', createRoute(retriveSensorData));
sensorRouter.get('/sensor-average', createRoute(getSensorAverage));

// Rota de depuração
sensorRouter.get('/debug2', (req, res) => {
  res.send('worksasc');
});

export default sensorRouter;