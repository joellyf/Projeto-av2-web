/*
  Servidor: configura o Express, conecta ao MongoDB,
  define rotas de produtos, usuários e pedidos.
  Comentários curtos e humanos — não alteram o código.
*/
require('dotenv').config();
console.log(process.env.MONGO_URI);
// Dependências principais: framework, CORS, criptografia, JWT e banco
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const verificarToken = require('./middlewares/verificarToken');
const Usuario = require('./modelos/Usuario');
const Pedido = require('./modelos/Pedido');
const Produto = require('./modelos/Produto')
const preencherBancoSeVazio = require('./banco_config/preencherBanco')

const app = express();
app.use(cors());
app.use(express.json());

// Porta e configurações de segurança/cripto usadas nas rotas abaixo
const PORTA = process.env.PORTA || 5000;
const SEGREDO_JWT = process.env.SEGREDO_JWT;
const TEMPO_EXPIRACAO_TOKEN = '7d';
const RODADAS_CRIPTOGRAFIA = 10;
const MONGO_URI = process.env.MONGO_URI;

// Conecta ao MongoDB e popula dados iniciais se estiver vazio
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
    preencherBancoSeVazio();
  })
  .catch((erro) => console.error('❌ Erro ao conectar ao MongoDB:', erro.message));

// Rota raiz: retorna mensagem simples para checar se o servidor está online
app.get('/', (req, res) => {
  res.send("O servidor está online e pronto para receber requisições.");
});

// Rota: lista todos os produtos (GET /api/produtos)
app.get('/api/produtos', async (req, res) => {
  console.log("O front-end solicitou a lista de produtos.");
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar produtos no banco." });
  }
});

// Rota: detalhes de um produto por id (GET /api/produtos/:id)
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produtoEncontrado = await Produto.findById(req.params.id);

    if (!produtoEncontrado) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    console.log(`Produto visualizado: ${produtoEncontrado.nome}`);
    res.json(produtoEncontrado);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar detalhes do produto." });
  }
});

// Rota: cadastro de usuário (POST /api/usuarios/cadastro)
// Valida campos, checa email duplicado e salva com senha criptografada
app.post('/api/usuarios/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Por favor, preencha todos os campos obrigatórios." });
  }

  try {
    // Verifica se já existe usuário com este e-mail
    const emailJaCadastrado = await Usuario.findOne({ email });
    if (emailJaCadastrado) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }

    // Criptografa a senha antes de salvar no banco
    const senhaCriptografada = await bcrypt.hash(senha, RODADAS_CRIPTOGRAFIA);
    // Cria o documento do usuário (senha em hash)
    const novoUsuario = await Usuario.create({ nome, email, senha: senhaCriptografada });

    console.log(`✅ Novo usuário cadastrado: ${nome}`);

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuarioId: novoUsuario._id
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
});

// Rota: login de usuário (POST /api/usuarios/login)
// Verifica credenciais e retorna token JWT em caso de sucesso
app.post('/api/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  try {
    // Recupera usuário pelo e-mail (se existir)
    const usuarioEncontrado = await Usuario.findOne({ email });
    if (!usuarioEncontrado) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    // Compara a senha enviada com a hash salva no banco
    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const dadosDoToken = {
      usuarioId: usuarioEncontrado._id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email
    };

    // Gera token JWT assinado com a chave do servidor
    const token = jwt.sign(dadosDoToken, SEGREDO_JWT, { expiresIn: TEMPO_EXPIRACAO_TOKEN });

    console.log(`Login realizado: ${usuarioEncontrado.nome}`);

    res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuarioEncontrado._id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
      }
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao realizar login." });
  }
});

// Rota: finalizar pedido (POST /api/pedidos/checkout)
// Requer token — cria um pedido vinculado ao usuário autenticado
app.post('/api/pedidos/checkout', verificarToken, async (req, res) => {
  const { itens, valorTotal } = req.body;

  if (!itens || itens.length === 0) {
    return res.status(400).json({ erro: "Não é possível finalizar um pedido com o carrinho vazio." });
  }

  if (!valorTotal || valorTotal <= 0) {
    return res.status(400).json({ erro: "O valor total do pedido é inválido." });
  }

  try {
    // Monta o objeto do pedido e salva no banco
    const novoPedido = await Pedido.create({
      // idPedido simples gerado aleatoriamente para exibição
      idPedido: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      usuario: req.usuario.usuarioId,
      itens,
      valorTotal,
      status: "Processando Pagamento"
    });

    console.log(`Pedido ${novoPedido.idPedido} registrado! Total: R$ ${valorTotal.toFixed(2)}`);

    res.status(201).json({
      mensagem: "Compra finalizada com sucesso!",
      pedido: {
        idPedido: novoPedido.idPedido,
        dataDoPedido: novoPedido.createdAt.toLocaleDateString('pt-BR'),
        itens: novoPedido.itens,
        valorTotal: novoPedido.valorTotal,
        status: novoPedido.status
      }
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao finalizar pedido." });
  }
});

app.listen(PORTA, () => {
  console.log("==================================================");
  console.log(`  SERVIDOR DA RAFA COSMÉTICOS INICIADO!`);
  console.log(`  Porta: ${PORTA}`);
  console.log(`  Acesse: http://localhost:${PORTA}`);
  console.log("==================================================");
});