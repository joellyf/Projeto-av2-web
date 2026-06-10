import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { Flower2 } from 'lucide-react';
import './Rodape.css';

const Rodape = () => {
  return (
    <footer className="rodape">

      <div className="rodape__conteudo">

        <div className="rodape__coluna">
          <div className="rodape__logo">
            <Flower2 size={24} />
            <span>Rafa Cosméticos</span>
          </div>

          <div className="rodape__redes">
            <a href="#">
              <FaInstagram size={18} />
            </a>

            <a href="#">
              <FaWhatsapp size={18} />
            </a>

            <a href="#">
              <FaFacebook size={18} />
            </a>
          </div>
        </div>

        <div className="rodape__coluna">
          <h4>Institucional</h4>

          <a href="#">Sobre nós</a>
          <a href="#">Política de privacidade</a>
          <a href="#">Termos de uso</a>
        </div>

        <div className="rodape__coluna">
          <h4>Ajuda</h4>

          <a href="#">Perguntas frequentes</a>
          <a href="#">Trocas e devoluções</a>
          <a href="#">Fale conosco</a>
        </div>

        <div className="rodape__coluna">
          <h4>Formas de pagamento</h4>

          <div className="rodape__pagamentos">
            <span>Visa</span>
            <span>Master</span>
            <span>Pix</span>
          </div>
        </div>

      </div>

      <div className="rodape__copyright">
        © 2026 Rafa Cosméticos. Todos os direitos reservados.
      </div>

    </footer>
  );
};

export default Rodape;