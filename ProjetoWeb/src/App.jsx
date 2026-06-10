/*
  Componente raiz: configura rotas, estado do carrinho e componentes compartilhados.
  Contém rotas públicas e protegidas, e lógica do carrinho em memória.
*/
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { estaAutenticado } from './servicos/autenticacao';

import Header from './componentes/Header';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import ListaProdutos from './componentes/ListaProdutos';
import DetalheProduto from './paginas/DetalheProduto';
import Carrinho from './componentes/Carrinho';
import Checkout from './paginas/Checkout';
import Rodape from './componentes/Rodape';
import './App.css';

// Componente que protege rotas, redirecionando para /login se não autenticado
const RotaProtegida = ({ children }) => {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Renderiza o `Header` apenas em rotas que o utilizam
const HeaderCondicional = ({ quantidadeItensCarrinho }) => {
  const localizacao = useLocation();

  const rotasSemHeader = ['/login', '/cadastro'];

  if (rotasSemHeader.includes(localizacao.pathname)) {
    return null;
  }

  return <Header quantidadeItensCarrinho={quantidadeItensCarrinho} />;
};

// Renderiza o `Rodape` apenas em rotas que o utilizam
const RodapeCondicional = () => {
  const localizacao = useLocation();

  const rotasSemRodape = ['/login', '/cadastro'];

  if (rotasSemRodape.includes(localizacao.pathname)) {
    return null;
  }

  return <Rodape />;
};

const App = () => {
  const [itensCarrinho, setItensCarrinho] = useState([]);

  // Adiciona produto ao carrinho (aumenta quantidade se já existir)
  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item._id === produto._id);

      if (itemExistente) {
        return itensAtuais.map((item) =>
          item._id === produto._id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  };

  // Remove item do carrinho pelo id
  const removerDoCarrinho = (idProduto) => {
    setItensCarrinho((itensAtuais) =>
      itensAtuais.filter((item) => item._id !== idProduto)
    );
  };

  // Atualiza a quantidade de um item (remove se novaQuantidade <= 0)
  const alterarQuantidade = (idProduto, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(idProduto);
      return;
    }

    setItensCarrinho((itensAtuais) =>
      itensAtuais.map((item) =>
        item._id === idProduto ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  // Limpa o carrinho (usado após finalizar pedido)
  const limparCarrinho = () => {
    setItensCarrinho([]);
  };

  const quantidadeItensCarrinho = itensCarrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  return (
    <BrowserRouter>
      <HeaderCondicional quantidadeItensCarrinho={quantidadeItensCarrinho} />

      <main className="conteudo-principal">
        <Routes>
          <Route path="/" element={<Navigate to="/produtos" replace />} />
          {/* Rotas públicas: login e cadastro */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Lista de produtos (página inicial) */}
          <Route
            path="/produtos"
            element={<ListaProdutos aoAdicionarCarrinho={adicionarAoCarrinho} />}
          />

          {/* Página de detalhe de um produto */}
          <Route
            path="/produtos/:id"
            element={<DetalheProduto aoAdicionarCarrinho={adicionarAoCarrinho} />}
          />

          {/* Carrinho: mostra itens adicionados */}
          <Route
            path="/carrinho"
            element={
              <Carrinho
                itensCarrinho={itensCarrinho}
                aoRemoverItem={removerDoCarrinho}
                aoAlterarQuantidade={alterarQuantidade}
              />
            }
          />

          {/* Checkout: rota protegida, requer autenticação */}
          <Route
            path="/checkout"
            element={
              <RotaProtegida>
                <Checkout
                  itensCarrinho={itensCarrinho}
                  aoLimparCarrinho={limparCarrinho}
                />
              </RotaProtegida>
            }
          />
        </Routes>
      </main>
    <RodapeCondicional/>
  </BrowserRouter>
  );
};

export default App;