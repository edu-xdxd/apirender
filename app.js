require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error de conexión:', err));

// Modelo para datos X, Y, Z
const DatosSchema = new mongoose.Schema({
  X: { type: Number },
  Y: { type: Number },
  Z: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

// Modelo para ritmo
const RitmoSchema = new mongoose.Schema({
  ritmo: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Datos = mongoose.model('Datos', DatosSchema);
const Ritmo = mongoose.model('Ritmo', RitmoSchema);

// Endpoint para insertar datos y ritmo en colecciones separadas
app.post('/datos', async (req, res) => {
  try {
    const { X, Y, Z, ritmo } = req.body;
    console.log('Datos recibidos:', X, Y, Z, ritmo);
    
    // Crear documentos para cada colección
    const nuevosDatos = new Datos({ X, Y, Z });
    const nuevoRitmo = new Ritmo({ ritmo });
    
    // Guardar en ambas colecciones
    await nuevosDatos.save();
    await nuevoRitmo.save();
    
    res.status(201).json({
      datos: nuevosDatos,
      ritmo: nuevoRitmo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 
