const jwt = require('jsonwebtoken');

const SEGREDO_JWT = 'meu_segredo_secreto_troque_em_producao';

const verificarToken = (req, res, next) => {
  const cabecalhoAutorizacao = req.headers['authorization'];

  if (!cabecalhoAutorizacao) {
    return res.status(401).json({ erro: "Acesso negado. Nenhum token fornecido." });
  }

  const token = cabecalhoAutorizacao.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: "Formato de token inválido. Use: Bearer <token>" });
  }

  try {
    const dadosDecodificados = jwt.verify(token, SEGREDO_JWT);
    req.usuario = dadosDecodificados;
    next();
  } catch (erro) {
    return res.status(403).json({ erro: "Token inválido ou expirado. Faça login novamente." });
  }
};

module.exports = verificarToken;