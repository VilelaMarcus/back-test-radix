import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import upload from '../utils/multerConfig';
import { uploadCsvController } from '../controller/UploadCsvController';

const prisma = new PrismaClient();
const csvRouter = Router();

csvRouter.post('/upload-csv', upload.single('csvFile'), uploadCsvController);

export default csvRouter;