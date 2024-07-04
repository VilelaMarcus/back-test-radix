import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Diretório onde os arquivos serão armazenados temporariamente
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Nome do arquivo como o original enviado
  }
});

const upload = multer({ storage: storage });

export default upload;