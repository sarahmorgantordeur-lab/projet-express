const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Routes
const userRoutes = require('./routes/users.routes');
app.use('/users', userRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('🚀 API Express opérationnelle');
});

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
