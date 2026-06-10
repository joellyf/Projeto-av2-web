const URL_BASE = 'http://localhost:5000/api';

// Retorna token salvo
const pegarToken = () => localStorage.getItem('token');

// Cabeçalho para requisições autenticadas
const cabecalhoAutenticado = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${pegarToken()}`
});

// Cabeçalho padrão para requisições públicas
const cabecalhoPadrao = () => ({
  'Content-Type': 'application/json'
});

// Função genérica para fazer fetch e tratar erros retornados pelo backend
const requisicao = async (endpoint, opcoes = {}) => {
  const resposta = await fetch(`${URL_BASE}${endpoint}`, opcoes);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Algo deu errado na requisição.');
  }

  return dados;
};

export { URL_BASE, cabecalhoAutenticado, cabecalhoPadrao, requisicao };