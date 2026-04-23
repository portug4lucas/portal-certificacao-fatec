/**
 * jwt.test.js — Testes do módulo JWT
 * Execute com: node auth/jwt.test.js
 * (não requer Jest; usa apenas o módulo assert nativo do Node)
 */

'use strict';

// Simula variáveis de ambiente antes de importar o módulo
process.env.JWT_ACCESS_SECRET  = 'segredo_acesso_teste_fatec';
process.env.JWT_REFRESH_SECRET = 'segredo_refresh_teste_fatec';
process.env.JWT_ACCESS_EXPIRES = '2s';   // curto para testar expiração

const assert = require('assert');
const {
  gerarAccessToken,
  gerarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken,
} = require('./jwt');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const usuarioFake = { id: 1, cpf: '12345678901', nome: 'Ana Silva', email: 'ana@fatec.sp.gov.br' };

function esperar(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let ok = 0, falhou = 0;

async function teste(descricao, fn) {
  try {
    await fn();
    console.log(`  ✓  ${descricao}`);
    ok++;
  } catch (e) {
    console.error(`  ✗  ${descricao}`);
    console.error(`     → ${e.message}`);
    falhou++;
  }
}

// ---------------------------------------------------------------------------
// Suíte de testes
// ---------------------------------------------------------------------------
(async () => {
  console.log('\n=== Testes JWT — Portal de Certificação FATEC ===\n');

  // 1. Geração básica
  await teste('Gera Access Token (string não vazia)', () => {
    const token = gerarAccessToken(usuarioFake);
    assert.ok(typeof token === 'string' && token.length > 0);
  });

  await teste('Gera Refresh Token (string não vazia)', () => {
    const token = gerarRefreshToken(usuarioFake);
    assert.ok(typeof token === 'string' && token.length > 0);
  });

  await teste('Token tem três partes separadas por ponto (formato JWT)', () => {
    const token = gerarAccessToken(usuarioFake);
    assert.strictEqual(token.split('.').length, 3);
  });

  // 2. Verificação bem-sucedida
  await teste('Access Token válido é verificado corretamente', () => {
    const token = gerarAccessToken(usuarioFake);
    const r = verificarAccessToken(token);
    assert.ok(r.valido);
    assert.strictEqual(r.dados.cpf, usuarioFake.cpf);
    assert.strictEqual(r.dados.nome, usuarioFake.nome);
  });

  await teste('Refresh Token válido é verificado corretamente', () => {
    const token = gerarRefreshToken(usuarioFake);
    const r = verificarRefreshToken(token);
    assert.ok(r.valido);
    assert.strictEqual(r.dados.sub, usuarioFake.id);
  });

  // 3. Token adulterado
  await teste('Token com assinatura adulterada é rejeitado', () => {
    const token = gerarAccessToken(usuarioFake);
    const partes = token.split('.');
    partes[2] = partes[2].slice(0, -4) + 'XXXX'; // corrompe a assinatura
    const r = verificarAccessToken(partes.join('.'));
    assert.ok(!r.valido);
    assert.strictEqual(r.erro, 'JsonWebTokenError');
  });

  await teste('Access Token verificado com segredo errado é rejeitado', () => {
    const token = gerarAccessToken(usuarioFake);
    const r = verificarRefreshToken(token); // usa segredo de refresh para access
    assert.ok(!r.valido);
  });

  // 4. Token expirado (ACCESS_EXPIRES = '2s' → aguarda 3s)
  await teste('Access Token expirado retorna TokenExpiredError', async () => {
    const token = gerarAccessToken(usuarioFake);
    await esperar(3000);
    const r = verificarAccessToken(token);
    assert.ok(!r.valido);
    assert.strictEqual(r.erro, 'TokenExpiredError');
  });

  // 5. Payload inválido
  await teste('Gerar token sem id lança TypeError', () => {
    assert.throws(() => gerarAccessToken({ nome: 'Sem ID' }), TypeError);
  });

  await teste('Gerar token com payload nulo lança TypeError', () => {
    assert.throws(() => gerarAccessToken(null), TypeError);
  });

  // 6. Payload não vaza senha
  await teste('Token não contém campo "senha" no payload', () => {
    const payloadComSenha = { ...usuarioFake, senha: 'secreta123' };
    const token = gerarAccessToken(payloadComSenha);
    const r = verificarAccessToken(token);
    assert.ok(r.valido);
    assert.strictEqual(r.dados.senha, undefined);
  });

  // ---------------------------------------------------------------------------
  console.log(`\n  Total: ${ok + falhou} | ✓ Passou: ${ok} | ✗ Falhou: ${falhou}\n`);
  if (falhou > 0) process.exit(1);
})();