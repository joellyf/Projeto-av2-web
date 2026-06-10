const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  // Nome completo do usuário
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  // E-mail único usado para login e identificação do usuário
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true
  },
  // Hash da senha
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória']
  },
  // URL ou caminho da foto de perfil do usuário 
  fotoPerfil: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', esquemaUsuario);

module.exports = Usuario;