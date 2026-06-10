import { useState, useEffect } from 'react';
import { PackageSearch } from 'lucide-react';
import CardProduto from './CardProduto';
import { buscarTodosProdutos } from '../servicos/produtos';
import './ListaProdutos.css';

const ListaProdutos = ({ aoAdicionarCarrinho }) => {
  const [listaDeProdutos, setListaDeProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Carrega lista de produtos do backend ao montar o componente
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const produtos = await buscarTodosProdutos();
        setListaDeProdutos(produtos);
      } catch (erroRecebido) {
        setErro('Não foi possível carregar os produtos. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  //carregando
  if (carregando) {
    return (
      <div className="lista-produtos__estado">
        <div className="lista-produtos__spinner" />
        <p>Carregando produtos...</p>
      </div>
    );
  }

  // erro ao buscar produtos
  if (erro) {
    return (
      <div className="lista-produtos__estado">
        <PackageSearch size={48} className="lista-produtos__icone-vazio" />
        <p className="lista-produtos__mensagem-erro">{erro}</p>
      </div>
    );
  }

  // lista vazia
  if (listaDeProdutos.length === 0) {
    return (
      <div className="lista-produtos__estado">
        <PackageSearch size={48} className="lista-produtos__icone-vazio" />
        <p>Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  return (
    <section className="lista-produtos">
      <div className="lista-produtos__cabecalho">
        <h1 className="lista-produtos__titulo">Nossos Produtos</h1>
        <p className="lista-produtos__subtitulo">{listaDeProdutos.length} produtos disponíveis</p>
      </div>

      <div className="lista-produtos__grade">
        {listaDeProdutos.map((produto) => (
          <CardProduto
            key={produto.id}
            produto={produto}
            aoAdicionarCarrinho={aoAdicionarCarrinho}
          />
        ))}
      </div>
    </section>
  );
};

export default ListaProdutos;