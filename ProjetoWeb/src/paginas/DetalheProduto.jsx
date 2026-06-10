import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, PackageSearch } from 'lucide-react';
import { buscarProdutoPorId } from '../servicos/produtos';
import './DetalheProduto.css';

const DetalheProduto = ({ aoAdicionarCarrinho }) => {
  const { id } = useParams();
  const navegar = useNavigate();

  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [adicionado, setAdicionado] = useState(false);

  // Carrega detalhes do produto sempre que o id da rota muda
  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const dadosDoProduto = await buscarProdutoPorId(id);
        setProduto(dadosDoProduto);
      } catch (erroRecebido) {
        setErro('Produto não encontrado.');
      } finally {
        setCarregando(false);
      }
    };

    carregarProduto();
  }, [id]);

  // Adiciona produto ao carrinho e mostra feedback temporário "Adicionado"
  const aoClicarAdicionarCarrinho = () => {
    aoAdicionarCarrinho(produto);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  if (carregando) {
    return (
      <div className="detalhe-produto__estado">
        <div className="detalhe-produto__spinner" />
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="detalhe-produto__estado">
        <PackageSearch size={48} className="detalhe-produto__icone-vazio" />
        <p className="detalhe-produto__mensagem-erro">{erro}</p>
        <button className="detalhe-produto__botao-voltar" onClick={() => navegar('/produtos')}>
          Voltar para produtos
        </button>
      </div>
    );
  }

  return (
    <div className="detalhe-produto">

      {/* Link para voltar à lista de produtos */}
      <button className="detalhe-produto__link-voltar" onClick={() => navegar('/produtos')}>
        <ArrowLeft size={18} />
        Voltar para produtos
      </button>

      <div className="detalhe-produto__conteudo">

        {/* Espaço para imagem grande ou placeholder com inicial */}
        <div className="detalhe-produto__imagem-placeholder">
          <span>{produto.nome.charAt(0)}</span>
        </div>

        {/* Informações do produto: nome, descrição e ação de adicionar */}
        <div className="detalhe-produto__informacoes">
          <h1 className="detalhe-produto__nome">{produto.nome}</h1>
          <p className="detalhe-produto__descricao">{produto.descricao}</p>

          <div className="detalhe-produto__rodape">
            {/* Preço em destaque */}
            <span className="detalhe-produto__preco">
              R$ {produto.preco.toFixed(2)}
            </span>

            {/* Botão que adiciona ao carrinho e mostra texto temporário */}
            <button
              className={`detalhe-produto__botao-carrinho ${adicionado ? 'detalhe-produto__botao-carrinho--adicionado' : ''}`}
              onClick={aoClicarAdicionarCarrinho}
            >
              <ShoppingCart size={20} />
              {adicionado ? 'Adicionado!' : 'Adicionar ao carrinho'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetalheProduto;