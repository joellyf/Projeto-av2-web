const mongoose = require('mongoose');

const esquemaItemPedido = new mongoose.Schema({
  produtoId: {
    type: Number,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

const esquemaPedido = new mongoose.Schema({
  idPedido: {
    type: String,
    required: true,
    unique: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  itens: [esquemaItemPedido],
  valorTotal: {
    type: Number,
    required: true
  },
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