/*
  Funções relacionadas a produtos: buscar lista e buscar por id.
  Chamam o `requisicao` do serviço API e retornam dados do backend.
*/
import { requisicao, cabecalhoPadrao } from './api';

// Busca todos os produtos (GET /produtos) e retorna array
const buscarTodosProdutos = async () => {
  const dados = await requisicao('/produtos', {
    method: 'GET',
    headers: cabecalhoPadrao()
  });

  return dados;
};

// Busca os detalhes de um produto por id (GET /produtos/:id)
const buscarProdutoPorId = async (id) => {
  const dados = await requisicao(`/produtos/${id}`, {
    method: 'GET',
    headers: cabecalhoPadrao()
  });

  return dados;
};

export { buscarTodosProdutos, buscarProdutoPorId };