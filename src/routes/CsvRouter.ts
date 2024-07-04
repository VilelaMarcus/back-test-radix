import { Router } from 'express';
import { uploadCsv } from '../controller/UploadCsvController';
import createRoute from '../middleware/create-route';

const csvRouter = Router();

csvRouter.post('/upload-csv', createRoute(uploadCsv));

export default csvRouter;