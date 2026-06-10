const mongoose = require('mongoose');

const esquemaProduto = new mongoose.Schema({
  // Nome exibido do produto
  nome: {
    type: String,
    required: [true, 'O nome do produto é obrigatório'],
    trim: true
  },
  // Preço numérico do produto
  preco: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  // URL ou caminho da imagem do produto
  imagem: {
    type: String,
    default: null
  }
}, 
{
  timestamps: true
});

const Produto = mongoose.model('Produto', esquemaProduto);

module.exports = Produto;