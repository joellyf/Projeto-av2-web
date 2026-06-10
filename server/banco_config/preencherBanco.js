const Produto = require('../modelos/Produto');

async function preencherBancoSeVazio() {
  try {
    const qtdProdutos = await Produto.countDocuments();
    if (qtdProdutos === 0) {
      const listaDeProdutosInicial = [
        { nome: "Essencial tradicional", preco: 249.90, imagem: "https://images.pedidos2.natura.net/image/sku/145x145/76420_1.jpg"},
        { nome: "Kaiak Extremo", preco: 151.90, imagem: "https://images.pedidos2.natura.net/image/sku/145x145/249685_1.jpg"},
        { nome: "Luna radiante", preco: 130.00, imagem: "https://images.pedidos2.natura.net/image/sku/145x145/2550_1.jpg"},
        { nome: "Natura homem coragio", preco: 299.90, imagem: "https://images.pedidos2.natura.net/image/sku/145x145/89834_1.jpg"},
        { nome: "Una artisan", preco: 300.00, imagem: "https://images.pedidos2.natura.net/image/sku/145x145/2458_1.jpg"},
        { nome: "Ekos maracuja", preco: 79.90, imagem: "https://images.pedidos2.natura.net/image/sku/145x145/73564_1.jpg"},
        { nome: "", preco: 0, imagem: ""},
        { nome: "", preco: 0, imagem: ""},
        { nome: "", preco: 0, imagem: ""},
        { nome: "", preco: 0, imagem: ""}
      ];
      await Produto.insertMany(listaDeProdutosInicial);
      console.log("✅ Banco de dados preenchido com os 10 produtos.");
    }
  } catch (err) {
    console.error("Erro ao popular banco inicial:", err);
  }
}

module.exports = preencherBancoSeVazio;