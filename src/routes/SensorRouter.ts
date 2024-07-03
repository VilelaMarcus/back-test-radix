import { Router } from 'express';
import { receiveSensorData } from '../controller/SensorDataController';
import { getSensorAverage } from '../controller/SensorAverageController';

const sensorRouter = Router();

sensorRouter.post('/sensor-data', receiveSensorData);
sensorRouter.get('/sensor-average', getSensorAverage);

export default sensorRouter;