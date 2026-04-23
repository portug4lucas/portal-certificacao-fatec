'use strict';

const express = require('express');
const router  = express.Router();

const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken, autenticar } = require('./jwt');

router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) {
    return res.status(400).json({ erro: 'CPF e senha são obrigatórios.' });
  }
  // TODO: buscar usuário no PostgreSQL
  return res.status(401).json({ erro: 'Usuário não encontrado.' });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ erro: 'Refresh token não informado.' });
  const resultado = verificarRefreshToken(refreshToken);
  if (!resultado.valido) return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  const novoAccessToken = gerarAccessToken({ id: resultado.dados.sub });
  return res.json({ accessToken: novoAccessToken });
});

router.post('/logout', autenticar, (req, res) => {
  return res.json({ mensagem: 'Logout realizado.' });
});

router.get('/me', autenticar, (req, res) => {
  return res.json(req.usuario);
});

module.exports = router;