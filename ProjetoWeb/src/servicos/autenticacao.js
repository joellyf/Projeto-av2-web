/*
  Autenticação: funções para login, cadastro, logout e estado do usuário.
  Usa o serviço de API e guarda token/usuario no localStorage.
*/
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

// Faz cadastro de usuário: envia nome, email e senha ao backend
const realizarCadastro = async (nome, email, senha) => {
  const dados = await requisicao('/usuarios/cadastro', {
    method: 'POST',
    headers: cabecalhoPadrao(),
    body: JSON.stringify({ nome, email, senha })
  });

  return dados;
};

// Remove credenciais locais (logout)
const realizarLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioLogado');
};

// Recupera dados do usuário gravados no localStorage (ou null)
const pegarUsuarioLogado = () => {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
};

// Simples verificação de autenticação baseada na presença do token
const estaAutenticado = () => {
  return !!localStorage.getItem('token');
};

export { realizarLogin, realizarCadastro, realizarLogout, pegarUsuarioLogado, estaAutenticado };