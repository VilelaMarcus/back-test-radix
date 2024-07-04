import multer from 'multer';
import path from 'path';

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome do arquivo salvo
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Verificar a extensão do arquivo
    const fileTypes = /csv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas arquivos CSV são permitidos.'));
    }
  }
});

export default upload;