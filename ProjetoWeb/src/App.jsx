import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { estaAutenticado } from './servicos/autenticacao';

import Header from './componentes/Header';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import ListaProdutos from './componentes/ListaProdutos';
import DetalheProduto from './paginas/DetalheProduto';
import Carrinho from './componentes/Carrinho';
import Checkout from './paginas/Checkout';

import './App.css';

const RotaProtegida = ({ children }) => {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.id === produto.id);

      if (itemExistente) {
        return itensAtuais.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (idProduto) => {
    setItensCarrinho((itensAtuais) =>
      itensAtuais.filter((item) => item.id !== idProduto)
    );
  };

  const alterarQuantidade = (idProduto, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(idProduto);
      return;
    }

    setItensCarrinho((itensAtuais) =>
      itensAtuais.map((item) =>
        item.id === idProduto ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
  };

  const quantidadeItensCarrinho = itensCarrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  return (
    <BrowserRouter>
      <Header quantidadeItensCarrinho={quantidadeItensCarrinho} />

      <main className="conteudo-principal">
        <Routes>
          <Route path="/" element={<Navigate to="/produtos" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/produtos"
            element={<ListaProdutos aoAdicionarCarrinho={adicionarAoCarrinho} />}
          />

          <Route
            path="/produtos/:id"
            element={<DetalheProduto aoAdicionarCarrinho={adicionarAoCarrinho} />}
          />

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
    </BrowserRouter>
  );
};

export default App;