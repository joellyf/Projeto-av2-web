const mongoose = require('mongoose');

const esquemaProduto = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do produto é obrigatório'],
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  descricao: {
    type: String,
    required: [true, 'A descrição é obrigatória'],
    trim: true
  },
  imagem: {
    type: String,
    default: null
  },
  disponivel: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Produto = mongoose.model('Produto', esquemaProduto);

module.exports = Produto;