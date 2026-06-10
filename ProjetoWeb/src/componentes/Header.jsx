import { ShoppingCart, Package, UserCircle2, LogOut, Flower2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { pegarUsuarioLogado, realizarLogout, estaAutenticado } from '../servicos/autenticacao';
import './Header.css';

const Header = ({ quantidadeItensCarrinho = 0 }) => {
  const navegar = useNavigate();
  const usuarioLogado = pegarUsuarioLogado();
  const autenticado = estaAutenticado();

  const aoClicarLogout = () => {
    realizarLogout();
    navegar('/login');
  };

  return (
    <header className="cabecalho">
      <div className="cabecalho__conteudo">

        <Link to="/produtos" className="cabecalho__logo">
          <Flower2 size={35} />
          <span>Rafa Cosméticos</span>
        </Link>

        <nav className="cabecalho__menu">
            <Link to="/" className="cabecalho__menu-link">
              Início
            </Link>

          <Link to="/produtos" className="cabecalho__menu-link">
            Produtos
          </Link>

          <Link to="/sobre" className="cabecalho__menu-link">
            Sobre nós
          </Link>

          <Link to="/contato" className="cabecalho__menu-link">
            Contato
          </Link>
        </nav>

        <nav className="cabecalho__navegacao">
        <div className="cabecalho__acoes">
          <Link to="/carrinho" className="cabecalho__carrinho">
            <ShoppingCart size={20} />
            <span className="cabecalho__carrinho-texto">Meu Carrinho</span>
            {quantidadeItensCarrinho > 0 && (
              <span className="cabecalho__badge">{quantidadeItensCarrinho}</span>
            )}
          </Link>

          {autenticado ? (
            <div className="cabecalho__perfil">
              <div className="cabecalho__perfil-info">
                <UserCircle2 size={32} className="cabecalho__perfil-icone" />
                <span className="cabecalho__perfil-nome">
                  {usuarioLogado?.nome.split(' ')[0]}
                </span>
              </div>
              <button className="cabecalho__botao-logout" onClick={aoClicarLogout}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="cabecalho__botao-login">
              <UserCircle2 size={32} className="cabecalho__perfil-icone" />
              <span>Fazer login</span>
            </Link>
          )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;