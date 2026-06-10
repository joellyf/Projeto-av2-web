/*
  Middleware de autenticação
  Verifica o token JWT no header "Authorization" e anexa os dados do usuário na requisição.
*/
const jwt = require('jsonwebtoken');

const SEGREDO_JWT = 'meu_segredo_secreto_troque_em_producao';

const verificarToken = (req, res, next) => {
  // Lê o header 'Authorization' no formato: 'Bearer <token>'
  const cabecalhoAutorizacao = req.headers['authorization'];

  if (!cabecalhoAutorizacao) {
    return res.status(401).json({ erro: "Acesso negado. Nenhum token fornecido." });
  }

  // Extrai o token após o tipo 'Bearer'
  const token = cabecalhoAutorizacao.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: "Formato de token inválido. Use: Bearer <token>" });
  }

  try {
    // Verifica e decodifica o token usando o segredo do servidor
    const dadosDecodificados = jwt.verify(token, SEGREDO_JWT);
    // Anexa os dados decodificados em `req.usuario` para uso nas rotas
    req.usuario = dadosDecodificados;
    next();
  } catch (erro) {
    return res.status(403).json({ erro: "Token inválido ou expirado. Faça login novamente." });
  }
};

module.exports = verificarToken;