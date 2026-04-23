'use strict';

const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'TROQUE_ACESSO';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'TROQUE_REFRESH';
const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES  || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function gerarAccessToken(payload) {
  if (!payload || !payload.id) throw new TypeError('Payload deve ter "id".');
  return jwt.sign(
    { sub: payload.id, cpf: payload.cpf, nome: payload.nome, email: payload.email },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES, algorithm: 'HS256' }
  );
}

function gerarRefreshToken(payload) {
  if (!payload || !payload.id) throw new TypeError('Payload deve ter "id".');
  return jwt.sign(
    { sub: payload.id },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES, algorithm: 'HS256' }
  );
}

function verificarAccessToken(token) {
  try {
    const dados = jwt.verify(token, ACCESS_SECRET, { algorithms: ['HS256'] });
    return { valido: true, dados };
  } catch (err) {
    return { valido: false, erro: err.name };
  }
}

function verificarRefreshToken(token) {
  try {
    const dados = jwt.verify(token, REFRESH_SECRET, { algorithms: ['HS256'] });
    return { valido: true, dados };
  } catch (err) {
    return { valido: false, erro: err.name };
  }
}

function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }
  const token = authHeader.split(' ')[1];
  const resultado = verificarAccessToken(token);
  if (!resultado.valido) {
    return res.status(resultado.erro === 'TokenExpiredError' ? 401 : 403)
              .json({ erro: resultado.erro });
  }
  req.usuario = resultado.dados;
  next();
}

module.exports = {
  gerarAccessToken,
  gerarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken,
  autenticar,
};