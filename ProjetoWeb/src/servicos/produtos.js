import { requisicao, cabecalhoPadrao } from './api';

const buscarTodosProdutos = async () => {
  const dados = await requisicao('/produtos', {
    method: 'GET',
    headers: cabecalhoPadrao()
  });

  return dados;
};

const buscarProdutoPorId = async (id) => {
  const dados = await requisicao(`/produtos/${id}`, {
    method: 'GET',
    headers: cabecalhoPadrao()
  });

  return dados;
};

export { buscarTodosProdutos, buscarProdutoPorId };