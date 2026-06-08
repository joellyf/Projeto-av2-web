const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória']
  },
  fotoPerfil: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', esquemaUsuario);

module.exports = Usuario;