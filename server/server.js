const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verificarToken = require('./middlewares/verificarToken');

const app = express();
app.use(cors());
app.use(express.json());

const PORTA = 5000;
const SEGREDO_JWT = 'meu_segredo_secreto_troque_em_producao';
const TEMPO_EXPIRACAO_TOKEN = '7d';
const RODADAS_CRIPTOGRAFIA = 10;

const listaDeProdutos = [
  {
    id: 1,
    nome: "Natura Ekos Castanha",
    preco: 45.90,
    descricao: "Polpa hidratante para as mãos com óleo de castanha. Nutrição imediata."
  },
  {
    id: 2,
    nome: "Desodorante Colônia Kaiak Masculino",
    preco: 149.90,
    descricao: "Fragrância hiperaquática. Um clássico da perfumaria nacional."
  },
  {
    id: 3,
    nome: "Tododia Algodão Hidratante",
    preco: 62.90,
    descricao: "Creme para o corpo com nutrição prebiótica. Pele macia todo dia."
  }
];

let usuariosCadastrados = [];
let pedidosRealizados = [];

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

  const emailJaCadastrado = usuariosCadastrados.find(usuario => usuario.email === email);
  if (emailJaCadastrado) {
    return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
  }

  const senhaCriptografada = await bcrypt.hash(senha, RODADAS_CRIPTOGRAFIA);

  const novoUsuario = {
    id: Date.now(),
    nome,
    email,
    senha: senhaCriptografada
  };

  usuariosCadastrados.push(novoUsuario);
  console.log(`✅ Novo usuário cadastrado: ${nome}`);

  res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso!",
    usuarioId: novoUsuario.id
  });
});

app.post('/api/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  const usuarioEncontrado = usuariosCadastrados.find(usuario => usuario.email === email);
  if (!usuarioEncontrado) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  const dadosDoToken = {
    usuarioId: usuarioEncontrado.id,
    nome: usuarioEncontrado.nome,
    email: usuarioEncontrado.email
  };

  const token = jwt.sign(dadosDoToken, SEGREDO_JWT, { expiresIn: TEMPO_EXPIRACAO_TOKEN });

  console.log(`Login realizado: ${usuarioEncontrado.nome}`);

  res.json({
    mensagem: "Login realizado com sucesso!",
    token,
    usuario: {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email
    }
  });
});

app.post('/api/pedidos/checkout', verificarToken, (req, res) => {
  const { itens, valorTotal } = req.body;

  if (!itens || itens.length === 0) {
    return res.status(400).json({ erro: "Não é possível finalizar um pedido com o carrinho vazio." });
  }

  if (!valorTotal || valorTotal <= 0) {
    return res.status(400).json({ erro: "O valor total do pedido é inválido." });
  }

  const novoPedido = {
    idPedido: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
    dataDoPedido: new Date().toLocaleDateString('pt-BR'),
    itens,
    valorTotal,
    status: "Processando Pagamento"
  };

  pedidosRealizados.push(novoPedido);

  console.log(`Pedido ${novoPedido.idPedido} registrado! Total: R$ ${valorTotal.toFixed(2)}`);

  res.status(201).json({
    mensagem: "Compra finalizada com sucesso!",
    pedido: novoPedido
  });
});

app.listen(PORTA, () => {
  console.log("==================================================");
  console.log(`  SERVIDOR DA LOJA DA VEIA INICIADO!`);
  console.log(`  Porta: ${PORTA}`);
  console.log(`  Acesse: http://localhost:${PORTA}`);
  console.log("==================================================");
});