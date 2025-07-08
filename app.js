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

// Modelo
const RitmoSchema = new mongoose.Schema({
  X: { type: Number, required: true },
  Y: { type: Number, required: true },
  Z: { type: Number, required: true },
  Ritmo: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Ritmo = mongoose.model('Ritmo', RitmoSchema);

// Endpoint para insertar
app.post('/ritmo', async (req, res) => {
  try {
    const { X, Y, Z, ritmo } = req.body;
    console.log(X, Y, Z, ritmo);
    const nuevoRitmo = new Ritmo({ X, Y, Z, ritmo });
    await nuevoRitmo.save();
    res.status(201).json(nuevoRitmo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 