import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CardProduto.css';

const CardProduto = ({ produto, aoAdicionarCarrinho }) => {
  const navegar = useNavigate();

  const aoClicarNoCard = () => {
    navegar(`/produtos/${produto.id}`);
  };

  const aoClicarAdicionarCarrinho = (evento) => {
    evento.stopPropagation();
    aoAdicionarCarrinho(produto);
  };

  return (
    <div className="card-produto" onClick={aoClicarNoCard}>
      <div className="card-produto__imagem-placeholder">
        <span>{produto.nome.charAt(0)}</span>
      </div>

      <div className="card-produto__info">
        <h3 className="card-produto__nome">{produto.nome}</h3>
        <p className="card-produto__descricao">{produto.descricao}</p>

        <div className="card-produto__rodape">
          <span className="card-produto__preco">
            R$ {produto.preco.toFixed(2)}
          </span>

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