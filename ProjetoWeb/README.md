Projeto AV2 - Web
=================

Resumo
------

Este repositório contém uma aplicação web simples com frontend em Vite/React e um backend Node.js. O objetivo é um projeto de comércio eletrônico básico: listar produtos, ver detalhes, cadastrar usuários e processar pedidos.

Por que este README?
--------------------

Escrevi este README em linguagem direta — sem jargões — para que qualquer pessoa consiga rodar o projeto e entender sua estrutura rapidamente.

Estrutura principal
-------------------

- ProjetoWeb/ - frontend (Vite + React).
- server/ - backend (Node.js, servidor Express ou similar).
- banco_config/ - scripts para popular o banco de dados.
- modelos/ - modelos Mongoose (ou equivalente) para Usuario, Produto, Pedido.

Como rodar (passo a passo)
--------------------------

Requisitos: ter node e npm instalados.

1) Instalar dependências do frontend:

bash
cd ProjetoWeb
npm install
npm run dev


Isso deve iniciar o servidor de desenvolvimento do frontend (Vite). Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

2) Instalar e rodar o backend:

bash
cd server
npm install
node server.js


Ou verifique package.json dentro de server/ para scripts alternativos (npm start, npm run dev).

3) Banco de dados

Se houver um script para popular o banco de dados, ele está em banco_config/. Execute-o conforme instruções (ex.: node banco_config/preencherBanco.js) — lembre-se de ter o banco em execução e as variáveis de ambiente configuradas.

Variáveis de ambiente importantes
-------------------------------

- MONGO_URI — string de conexão com o MongoDB.
- JWT_SECRET — segredo para assinar tokens (se o projeto usar autenticação JWT).
- PORT — porta do servidor backend (opcional).

Verifique os arquivos de configuração ou a documentação interna para confirmar nomes e formatos exatos.

Scripts úteis
------------

- Frontend: ver ProjetoWeb/package.json (dev, build, preview).
- Backend: ver server/package.json (start, dev).

O que você pode testar rápido
---------------------------

- Abrir a página inicial e verificar a listagem de produtos.
- Fazer login/cadastro (se implementado) e simular um pedido até a página de checkout.

Dicas e observações
-------------------

- Se algo não subir, olhe o console do terminal: mensagens de erro normalmente explicam o problema (dependência ausente, porta em uso, variável de ambiente faltando).
- Para ajustar a API, confira server/server.js e os arquivos em modelos/ e servicos/.

Contribuição
-----------

Quer melhorar algo? Abra uma issue descrevendo o problema ou envie um pull request com mudanças pequenas e um resumo do que foi alterado.