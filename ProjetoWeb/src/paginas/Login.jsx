import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Flower2 } from 'lucide-react';
import { realizarLogin } from '../servicos/autenticacao';
import './Login.css';

const Login = () => {
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const aoAlterarCampo = (evento) => {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  };

  const aoSubmeterFormulario = async (evento) => {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await realizarLogin(formulario.email, formulario.senha);
      const redirecionamento = sessionStorage.getItem('redirecionarAposLogin');
      navegar(redirecionamento || '/produtos');
    } catch (erroRecebido) {
      setErro(erroRecebido.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pagina-login">
      <div className="pagina-login__card">

        <div className="pagina-login__lado-esquerdo">
          <Flower2 size={44} className="pagina-login__icone-marca" />
          <h2 className="pagina-login__boas-vindas">Bem-vindo de volta</h2>
          <p className="pagina-login__descricao-marca">Nao sei ainda oque botar aqui, vou perguntar para a veia.</p>
          <Link to="/cadastro" className="pagina-login__botao-alternar">
            Criar conta
          </Link>
        </div>

        <div className="pagina-login__lado-direito">
          <h1 className="pagina-login__titulo">Entrar</h1>

          <form className="pagina-login__formulario" onSubmit={aoSubmeterFormulario}>

            <div className="pagina-login__campo">
              <label className="pagina-login__label">E-mail</label>
              <div className="pagina-login__input-wrapper">
                <input
                  className="pagina-login__input"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={formulario.email}
                  onChange={aoAlterarCampo}
                  required
                />
              </div>
            </div>

            <div className="pagina-login__campo">
              <label className="pagina-login__label">Senha</label>
              <div className="pagina-login__input-wrapper">
                <input
                  className="pagina-login__input"
                  type={senhaVisivel ? 'text' : 'password'}
                  name="senha"
                  placeholder="••••••••"
                  value={formulario.senha}
                  onChange={aoAlterarCampo}
                  required
                />
                <button
                  type="button"
                  className="pagina-login__botao-olho"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                >
                  {senhaVisivel ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="pagina-login__esqueci">
                <a href="mailto:suporte@lojavirtual.com" className="pagina-login__link-esqueci">
                  Esqueceu a senha?
                </a>
              </span>
            </div>

            {erro && <p className="pagina-login__erro">{erro}</p>}

            <button className="pagina-login__botao" type="submit" disabled={carregando}>
              <LogIn size={18} />
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;