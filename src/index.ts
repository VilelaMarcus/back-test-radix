import express, { Application } from 'express';
import sensorRouter from './routes/SensorRouter';
import csvRouter from './routes/CsvRouter';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api', sensorRouter);
app.use('/api', csvRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});