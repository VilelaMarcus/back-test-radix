import { Router } from 'express';
import { uploadCsv } from '../controller/UploadCsvController';

const csvRouter = Router();

csvRouter.post('/upload-csv', uploadCsv);

export default csvRouter;