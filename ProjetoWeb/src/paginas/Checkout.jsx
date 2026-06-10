import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { finalizarPedido } from '../servicos/pedidos';
import { pegarUsuarioLogado } from '../servicos/autenticacao';
import { useState } from 'react';
import './Checkout.css';

const Checkout = ({ itensCarrinho, aoLimparCarrinho }) => {
  const navegar = useNavigate();
  const usuarioLogado = pegarUsuarioLogado();

  const [carregando, setCarregando] = useState(false);
  const [pedidoFinalizado, setPedidoFinalizado] = useState(null);
  const [erro, setErro] = useState('');

  const valorTotal = itensCarrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  // Remove flag de redirecionamento após montar a página (se tiver)
  useEffect(() => {
    const redirecionamento = sessionStorage.getItem('redirecionarAposLogin');
    if (redirecionamento) {
      sessionStorage.removeItem('redirecionarAposLogin');
    }
  }, []);

  // Envia o pedido ao backend e trata resposta (limpa carrinho e mostra sucesso ou erro)
  const aoConfirmarPedido = async () => {
    setErro('');
    setCarregando(true);

    try {
      const resposta = await finalizarPedido(itensCarrinho, valorTotal);
      setPedidoFinalizado(resposta.pedido);
      aoLimparCarrinho();
    } catch (erroRecebido) {
      setErro('Não foi possível finalizar o pedido. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (pedidoFinalizado) {
    return (
      <div className="checkout__sucesso">
        <CheckCircle2 size={64} className="checkout__icone-sucesso" />
        <h1 className="checkout__titulo-sucesso">Pedido realizado!</h1>
        <p className="checkout__subtitulo-sucesso">
          Seu pedido <strong>{pedidoFinalizado.idPedido}</strong> foi registrado com sucesso.
        </p>
        <p className="checkout__data-sucesso">Data: {pedidoFinalizado.dataDoPedido}</p>
        <button className="checkout__botao-voltar" onClick={() => navegar('/produtos')}>
          <ShoppingBag size={18} />
          Continuar comprando
        </button>
      </div>
    );
  }

  if (itensCarrinho.length === 0) {
    return (
      <div className="checkout__vazio">
        <ShoppingBag size={48} className="checkout__icone-vazio" />
        <p>Seu carrinho está vazio.</p>
        <button className="checkout__botao-voltar" onClick={() => navegar('/produtos')}>
          Ver produtos
        </button>
      </div>
    );
  }

  return (
    <div className="checkout">

      {/* Título da página */}
      <h1 className="checkout__titulo">Finalizar Compra</h1>

      <div className="checkout__conteudo">

        {/* Seção de dados do comprador exibidos a partir do usuário logado */}
        <div className="checkout__secao">
          <h2 className="checkout__secao-titulo">Dados do comprador</h2>
          <div className="checkout__dados-usuario">
            <p className="checkout__dado">
              <span className="checkout__dado-label">Nome</span>
              <span className="checkout__dado-valor">{usuarioLogado?.nome}</span>
            </p>
            <p className="checkout__dado">
              <span className="checkout__dado-label">E-mail</span>
              <span className="checkout__dado-valor">{usuarioLogado?.email}</span>
            </p>
          </div>
        </div>

        {/* Seção da lista de itens do pedido e total */}
        <div className="checkout__secao">
          <h2 className="checkout__secao-titulo">Itens do pedido</h2>
          <div className="checkout__lista-itens">
            {itensCarrinho.map((item) => (
              <div key={item.id} className="checkout__item">
                <span className="checkout__item-nome">{item.nome}</span>
                <span className="checkout__item-quantidade">x{item.quantidade}</span>
                <span className="checkout__item-subtotal">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout__total">
            <span>Total</span>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Mensagem de erro se falhar ao confirmar pedido */}
        {erro && <p className="checkout__erro">{erro}</p>}

        {/* Botão que envia o pedido ao backend */}
        <button
          className="checkout__botao-confirmar"
          onClick={aoConfirmarPedido}
          disabled={carregando}
        >
          {carregando ? 'Processando...' : 'Confirmar pedido'}
        </button>

      </div>
    </div>
  );
};

export default Checkout;