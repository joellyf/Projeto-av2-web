/*
  Modelo: Produto (Mongoose)
  Campos básicos: nome, preço e imagem; usado para listar produtos.
*/
const mongoose = require('mongoose');

const esquemaProduto = new mongoose.Schema({
  // Nome exibido do produto
  nome: {
    type: String,
    required: [true, 'O nome do produto é obrigatório'],
    trim: true
  },
  // Preço numérico do produto (em reais, por exemplo)
  preco: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  // URL ou caminho da imagem do produto (opcional)
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