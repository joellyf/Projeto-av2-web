const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const verificarToken = require('./middlewares/verificarToken');
const Usuario = require('./modelos/Usuario');
const Pedido = require('./modelos/Pedido');

const app = express();
app.use(cors());
app.use(express.json());

const PORTA = 5000;
const SEGREDO_JWT = 'meu_segredo_secreto_troque_em_producao';
const TEMPO_EXPIRACAO_TOKEN = '7d';
const RODADAS_CRIPTOGRAFIA = 10;
const MONGO_URI = 'mongodb+srv://danilogabriel123:hJ6xuGLCnLNUpwnN@rafa-cosmeticos.dx4hf8q.mongodb.net/rafa-cosmeticos?appName=Rafa-Cosmeticos';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((erro) => console.error('❌ Erro ao conectar ao MongoDB:', erro.message));

const listaDeProdutos = [
  {
    id: 1,
    nome: "Essencial",
    preco: 279.90,
    descricao: "teste.",
    imagem: "https://images.pedidos2.natura.net/image/sku/145x145/76420_1.jpg"
  },
  {
    id: 2,
    nome: "Desodorante Colônia Kaiak Masculino",
    preco: 149.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 3,
    nome: "Tododia Algodão Hidratante",
    preco: 62.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 4,
    nome: "Perfume Una Feminino",
    preco: 219.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 5,
    nome: "teste",
    preco: 189.90,
    descricao: "Reduz rugas e linhas de expressão. Fórmula com ativo vegetal de alta performance.",
    imagem: ""
  },
  {
    id: 6,
    nome: "Shampoo Plant Cachos",
    preco: 59.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 7,
    nome: "Óleo Corporal Ekos Maracujá",
    preco: 79.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 8,
    nome: "Batom Faces Color Vermelho",
    preco: 34.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 9,
    nome: "Protetor Solar Tododia FPS 50",
    preco: 89.90,
    descricao: "teste",
    imagem: ""
  },
  {
    id: 10,
    nome: "Kit Presente Ekos Pitanga",
    preco: 159.90,
    descricao: "teste",
    imagem: ""
  }
];

app.get('/', (req, res) => {
  res.send("O servidor está online e pronto para receber requisições.");
});

app.get('/api/produtos', (req, res) => {
  console.log("O front-end solicitou a lista de produtos.");
  res.json(listaDeProdutos);
});

app.get('/api/produtos/:id', (req, res) => {
  const idSolicitado = Number(req.params.id);
  const produtoEncontrado = listaDeProdutos.find(produto => produto.id === idSolicitado);

  if (!produtoEncontrado) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  console.log(`Produto visualizado: ${produtoEncontrado.nome}`);
  res.json(produtoEncontrado);
});

app.post('/api/usuarios/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Por favor, preencha todos os campos obrigatórios." });
  }

  try {
    const emailJaCadastrado = await Usuario.findOne({ email });
    if (emailJaCadastrado) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, RODADAS_CRIPTOGRAFIA);
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

app.post('/api/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  try {
    const usuarioEncontrado = await Usuario.findOne({ email });
    if (!usuarioEncontrado) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const dadosDoToken = {
      usuarioId: usuarioEncontrado._id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email
    };

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

app.post('/api/pedidos/checkout', verificarToken, async (req, res) => {
  const { itens, valorTotal } = req.body;

  if (!itens || itens.length === 0) {
    return res.status(400).json({ erro: "Não é possível finalizar um pedido com o carrinho vazio." });
  }

  if (!valorTotal || valorTotal <= 0) {
    return res.status(400).json({ erro: "O valor total do pedido é inválido." });
  }

  try {
    const novoPedido = await Pedido.create({
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
  console.log(`  SERVIDOR DA LOJA DA VEIA INICIADO!`);
  console.log(`  Porta: ${PORTA}`);
  console.log(`  Acesse: http://localhost:${PORTA}`);
  console.log("==================================================");
});