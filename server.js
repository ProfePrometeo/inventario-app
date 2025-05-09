const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const LOG_FILE = path.join(__dirname, 'log.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// API POST
app.post('/api/equipos', upload.single('foto'), (req, res) => {
  const datos = req.body;
  if (req.file) {
    datos.foto = `/uploads/${req.file.filename}`;
  }

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    let inventario = [];
    if (!err && data) {
      inventario = JSON.parse(data);
    }

    inventario.push(datos);

    fs.writeFile(LOG_FILE, JSON.stringify(inventario, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar');
      res.status(200).send('Guardado');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Obtener todos los equipos
app.get('/api/equipos', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
      if (err) return res.status(500).send('Error al leer inventario');
      const inventario = JSON.parse(data || '[]');
      res.json(inventario);
    });
  });
// Eliminar equipo por índice
app.delete('/api/equipos/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
  
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
      if (err) return res.status(500).send('Error al leer inventario');
  
      let inventario = JSON.parse(data || '[]');
  
      if (index < 0 || index >= inventario.length) {
        return res.status(404).send('Índice fuera de rango');
      }
  
      // Opcional: eliminar la imagen asociada
      const equipo = inventario[index];
      if (equipo.foto) {
        const rutaImagen = path.join(__dirname, 'public', equipo.foto);
        fs.unlink(rutaImagen, () => {});
      }
  
      inventario.splice(index, 1);
      fs.writeFile(LOG_FILE, JSON.stringify(inventario, null, 2), err => {
        if (err) return res.status(500).send('Error al guardar');
        res.sendStatus(200);
      });
    });
  });
    