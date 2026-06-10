
import { requisicao, cabecalhoPadrao } from './api';

// Faz login: chama backend, salva token e dados do usuário no localStorage
const realizarLogin = async (email, senha) => {
  const dados = await requisicao('/usuarios/login', {
    method: 'POST',
    headers: cabecalhoPadrao(),
    body: JSON.stringify({ email, senha })
  });

  localStorage.setItem('token', dados.token);
  localStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));

  return dados;
};

// Faz cadastro de usuário e envia nome, email e senha ao backend
const realizarCadastro = async (nome, email, senha) => {
  const dados = await requisicao('/usuarios/cadastro', {
    method: 'POST',
    headers: cabecalhoPadrao(),
    body: JSON.stringify({ nome, email, senha })
  });

  return dados;
};

// Remove credenciais locais
const realizarLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioLogado');
};

// Recupera dados do usuário gravados no localStorage 
const pegarUsuarioLogado = () => {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
};

// verificação de autenticação baseada na presença do token
const estaAutenticado = () => {
  return !!localStorage.getItem('token');
};

export { realizarLogin, realizarCadastro, realizarLogout, pegarUsuarioLogado, estaAutenticado };