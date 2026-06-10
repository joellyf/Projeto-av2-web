import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CardProduto.css';

const CardProduto = ({ produto, aoAdicionarCarrinho }) => {
  const navegar = useNavigate();

  // Navega para a página de detalhe do produto quando clica no card
  const aoClicarNoCard = () => {
    navegar(`/produtos/${produto.id}`);
  };

  // Evita propagação do clique e adiciona o produto ao carrinho
  const aoClicarAdicionarCarrinho = (evento) => {
    evento.stopPropagation();
    aoAdicionarCarrinho(produto);
  };

  return (
    <div className="card-produto" onClick={aoClicarNoCard}>
      {/* Bloco de imagem: mostra foto se houver, senão espaço para inicial */}
      <div className="card-produto__imagem">
        {produto.imagem ? (
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="card-produto__foto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {/* espaço reservado: aparece quando não existe imagem */}
        <div className="card-produto__imagem-placeholder" style={{ display: produto.imagem ? 'none' : 'flex' }}>
          <span>{produto.nome.charAt(0)}</span>
        </div>
      </div>

      {/* Informações do produto: nome, descrição e rodapé */}
      <div className="card-produto__info">
        <h3 className="card-produto__nome">{produto.nome}</h3>
        <p className="card-produto__descricao">{produto.descricao}</p>

        <div className="card-produto__rodape">
          {/* Preço exibido */}
          <span className="card-produto__preco">
            R$ {produto.preco.toFixed(2)}
          </span>

          {/* Botão que adiciona o produto ao carrinho */}
          <button
            className="card-produto__botao"
            onClick={aoClicarAdicionarCarrinho}
          >
            <ShoppingCart size={16} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduto;