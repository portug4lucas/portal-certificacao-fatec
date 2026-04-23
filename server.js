require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/auth', require('./auth/auth.routes'));

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));