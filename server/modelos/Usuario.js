/*
  Modelo: Usuário (Mongoose)
  Define nome, email, senha e foto de perfil com timestamps.
*/
const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  // Nome completo do usuário (usado em exibições e identificação)
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
  // Hash da senha (nunca salvar a senha em texto claro)
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória']
  },
  // URL ou caminho da foto de perfil do usuário (opcional)
  fotoPerfil: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', esquemaUsuario);

module.exports = Usuario;