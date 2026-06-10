/*
  Pedidos: função para finalizar checkout (requisição autenticada).
*/
import { requisicao, cabecalhoAutenticado } from './api';

// Finaliza o pedido (POST /pedidos/checkout) — usa header autenticado
const finalizarPedido = async (itens, valorTotal) => {
  const dados = await requisicao('/pedidos/checkout', {
    method: 'POST',
    headers: cabecalhoAutenticado(),
    body: JSON.stringify({ itens, valorTotal })
  });

  return dados;
};

export { finalizarPedido };