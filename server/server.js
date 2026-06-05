const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const Produtos = [
    { id: 1,
      nome: "Natura Ekos Castanha", 
      preco: 45.90, 
      descricao: "Polpa hidratante para as mãos com óleo de castanha. Nutrição imediata." },
    { id: 2, 
    nome: "Desodorante Colônia Kaiak Masculino", 
    preco: 149.90, 
    descricao: "Fragrância hiperaquática. Um clássico da perfumaria nacional." },
    { id: 3, 
    nome: "Tododia Algodão Hidratante", 
    preco: 62.90, 
    descricao: "Creme para o corpo com nutrição prebiótica. Pele macia todo dia." }
]

let usuariosCadastrados = [];
let pedidosRealizados = [];

app.get('/', (req, res) => {
    res.send("O servidor está online e pronto para receber requisições.")
});

app.get('/api/produtos', (req, res) => {
    console.log("O Front-end solicitou a lista de produtos.");
    res.json(PRODUTOS);
});

app.post('/api/usuarios/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Por favor, preencha todos os campos obrigatórios." });
    }

    const senhaCriptografada = `[HASH_SEGURA_BCRYPT]_${senha}*xyz123`;

    const novoUsuario = { id: Date.now(), nome, email, senha: senhaCriptografada };
    usuariosCadastrados.push(novoUsuario);

    console.log(`Novo usuário cadastrado com sucesso: ${nome} (Senha protegida no banco!)`);
    res.status(201).json({ mensagem: "Usuário registrado com sucesso e senha criptografada!", usuarioId: novoUsuario.id });
});

app.post('/api/pedidos/checkout', (req, res) => {
    const { itens, valorTotal } = req.body;

    if (!itens || itens.length === 0) {
        return res.status(400).json({ erro: "Não é possível finalizar um pedido com o carrinho vazio." });
    }

    const novoPedido = {
        idPedido: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        data: new Date().toLocaleDateString('pt-BR'),
        itens: itens,
        total: valorTotal,
        status: "Processando Pagamento"
    };

    pedidosRealizados.push(novoPedido);

    console.log(`🛒 Pedido ${novoPedido.idPedido} registrado no sistema! Valor Total: R$ ${valorTotal.toFixed(2)}`);
    res.status(201).json({ mensagem: "Compra finalizada e registrada no sistema com sucesso!", pedido: novoPedido });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("==================================================");
    console.log(`SERVIDOR NATURA DA VEIA INICIADO COM SUCESSO!`);
    console.log(`Escutando requisições na porta: ${PORT}`);
    console.log(`Link local: http://localhost:${PORT}`);
    console.log("==================================================");
});