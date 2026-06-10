/*
  Modelo: Pedido (Mongoose)
  Estrutura de pedido com itens, usuário, total e status.
*/
const mongoose = require('mongoose');

const esquemaItemPedido = new mongoose.Schema({
  // Referência simples ao produto (pode ser id do catálogo)
  produtoId: {
    type: Number,
    required: true
  },
  // Nome do produto no momento da compra (registro histórico)
  nome: {
    type: String,
    required: true
  },
  // Preço unitário no momento da compra
  preco: {
    type: Number,
    required: true
  },
  // Quantidade comprada deste item
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

const esquemaPedido = new mongoose.Schema({
  // Identificador legível do pedido (ex: 'PED-1234')
  idPedido: {
    type: String,
    required: true,
    unique: true
  },
  // Ligação ao usuário que realizou a compra
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  // Lista de itens (cada item guarda nome, preço e quantidade)
  itens: [esquemaItemPedido],
  // Soma total do pedido
  valorTotal: {
    type: Number,
    required: true
  },
  // Estado do pedido na aplicação
  status: {
    type: String,
    enum: ['Processando Pagamento', 'Confirmado', 'Enviado', 'Entregue', 'Cancelado'],
    default: 'Processando Pagamento'
  }
}, {
  timestamps: true
});

const Pedido = mongoose.model('Pedido', esquemaPedido);

module.exports = Pedido;