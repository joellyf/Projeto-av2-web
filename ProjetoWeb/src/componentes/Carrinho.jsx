/* Componente Carrinho: lista itens no carrinho, controla quantidade
  e inicia finalização da compra */
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { estaAutenticado } from '../servicos/autenticacao';
import './Carrinho.css';

const Carrinho = ({ itensCarrinho, aoRemoverItem, aoAlterarQuantidade }) => {
  const navegar = useNavigate();

  // Calcula o total somando preço por quantidade para cada item
  const valorTotal = itensCarrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  // Verifica autenticação antes de finalizar a compra
  const aoFinalizarCompra = () => {
    if (!estaAutenticado()) {
      sessionStorage.setItem('redirecionarAposLogin', '/checkout');
      navegar('/login');
      return;
    }
    navegar('/checkout');
  };

  // Renderiza mensagem quando carrinho está vazio
  if (itensCarrinho.length === 0) {
    return (
      <div className="carrinho__vazio">
        <ShoppingBag size={56} className="carrinho__icone-vazio" />
        <h2 className="carrinho__titulo-vazio">Seu carrinho está vazio</h2>
        <p className="carrinho__subtitulo-vazio">Adicione produtos para continuar</p>
        <button className="carrinho__botao-continuar" onClick={() => navegar('/produtos')}>
          <ArrowLeft size={18} />
          Ver produtos
        </button>
      </div>
    );
  }

  return (
    <div className="carrinho">

      <div className="carrinho__cabecalho">
        <h1 className="carrinho__titulo">Meu Carrinho</h1>
        <span className="carrinho__quantidade">{itensCarrinho.length} {itensCarrinho.length === 1 ? 'item' : 'itens'}</span>
      </div>

      <div className="carrinho__conteudo">

        <div className="carrinho__lista">
          {itensCarrinho.map((item) => (
            <div key={item._id} className="carrinho__item">

            {/* Miniatura do produto ou inicial como placeholder */}
            <div className="carrinho__item-imagem">
                {item.imagem ? (
                  <img src={item.imagem} alt={item.nome} className="carrinho__foto-produto" />
                ) : (
                  <span>{item.nome.charAt(0)}</span>
                )}
              </div>

              {/* Informações básicas do item: nome e preço */}
              <div className="carrinho__item-info">
                <h3 className="carrinho__item-nome">{item.nome}</h3>
                <p className="carrinho__item-preco-unitario">R$ {item.preco.toFixed(2)} cada</p>
              </div>

              {/* Controles de quantidade: diminuir, número e aumentar */}
              <div className="carrinho__item-quantidade">
                <button
                  className="carrinho__botao-quantidade"
                  onClick={() => aoAlterarQuantidade(item._id, item.quantidade - 1)}
                >
                  <Minus size={14} />
                </button>
                <span className="carrinho__numero-quantidade">{item.quantidade}</span>
                <button
                  className="carrinho__botao-quantidade"
                  onClick={() => aoAlterarQuantidade(item._id, item.quantidade + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal do item e botão para remover do carrinho */}
              <span className="carrinho__item-subtotal">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </span>

              <button
                className="carrinho__botao-remover"
                onClick={() => aoRemoverItem(item._id)}
              >
                <Trash2 size={18} />
              </button>

            </div>
          ))}
        </div>

        <div className="carrinho__resumo">
          <h2 className="carrinho__resumo-titulo">Resumo do pedido</h2>

          <div className="carrinho__resumo-linha">
            <span>Subtotal</span>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>

          <div className="carrinho__resumo-linha">
            <span>Frete</span>
            <span className="carrinho__frete-gratis">Grátis</span>
          </div>

          <div className="carrinho__resumo-total">
            <span>Total</span>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>

          <button className="carrinho__botao-finalizar" onClick={aoFinalizarCompra}>
            Finalizar compra
          </button>

          <button className="carrinho__botao-voltar" onClick={() => navegar('/produtos')}>
            <ArrowLeft size={16} />
            Continuar comprando
          </button>
        </div>

      </div>
    </div>
  );
};

export default Carrinho;