import { requisicao, cabecalhoAutenticado } from './api';

const finalizarPedido = async (itens, valorTotal) => {
  const dados = await requisicao('/pedidos/checkout', {
    method: 'POST',
    headers: cabecalhoAutenticado(),
    body: JSON.stringify({ itens, valorTotal })
  });

  return dados;
};

export { finalizarPedido };