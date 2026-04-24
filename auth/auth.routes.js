'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const router  = express.Router();
const db      = require('../db');

const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken, autenticar } = require('./jwt');

router.post('/login', async (req, res) => {
  try {
    const { cpf, senha } = req.body;
    if (!cpf || !senha) {
      return res.status(400).json({ erro: 'CPF e senha são obrigatórios.' });
    }

    const resultado = await db.query(
      'SELECT id, cpf, nome, email, senha_hash FROM usuarios WHERE cpf = $1',
      [cpf]
    );

    const usuario = resultado.rows[0];
    if (!usuario) {
      return res.status(401).json({ erro: 'CPF ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'CPF ou senha incorretos.' });
    }

    const payload = { id: usuario.id, cpf: usuario.cpf, nome: usuario.nome, email: usuario.email };
    const accessToken  = gerarAccessToken(payload);
    const refreshToken = gerarRefreshToken(payload);

    await db.query('UPDATE usuarios SET refresh_token = $1 WHERE id = $2', [refreshToken, usuario.id]);

    return res.json({ accessToken, refreshToken });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

router.post('/cadastro', async (req, res) => {
  try {
    const { cpf, nome, email, senha } = req.body;
    if (!cpf || !nome || !email || !senha) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      'INSERT INTO usuarios (cpf, nome, email, senha_hash) VALUES ($1, $2, $3, $4)',
      [cpf, nome, email, senhaHash]
    );

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'CPF ou e-mail já cadastrado.' });
    }
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ erro: 'Refresh token não informado.' });
  const resultado = verificarRefreshToken(refreshToken);
  if (!resultado.valido) return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  const novoAccessToken = gerarAccessToken({ id: resultado.dados.sub });
  return res.json({ accessToken: novoAccessToken });
});

router.post('/logout', autenticar, async (req, res) => {
  await db.query('UPDATE usuarios SET refresh_token = NULL WHERE id = $1', [req.usuario.sub]);
  return res.json({ mensagem: 'Logout realizado.' });
});

router.get('/me', autenticar, (req, res) => {
  return res.json(req.usuario);
});

module.exports = router;