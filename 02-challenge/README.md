<p align="center">
  <img alt="Rocketseat Education" src="https://avatars.githubusercontent.com/u/69590972?s=200&v=4" width="100px" />
</p>

[![Node.js](https://img.shields.io/badge/node.js-16.14.2-green.svg)](https://nodejs.org/en/) [![TypeScript](https://img.shields.io/badge/typescript-4.9-blue.svg)](https://www.typescriptlang.org/) [![Fastify](https://img.shields.io/badge/fastify-4.28.1-brightgreen.svg)](https://www.fastify.io/)

# Daily Diet API

## Introdução

Este projeto foi desenvolvido como parte do desafio **Daily Diet API** do programa Ignite da Rocketseat. Ele consiste em uma API para controle de dieta diária, onde é possível gerenciar refeições e acompanhar métricas relacionadas à dieta de um usuário.

O objetivo do projeto foi consolidar os conhecimentos adquiridos no módulo de Node.js, aplicando conceitos como criação de APIs RESTful, validação de dados, autenticação via cookies, e manipulação de banco de dados com SQLite.

## O que a API faz?

A **Daily Diet API** permite que os usuários gerenciem suas refeições diárias e acompanhem métricas relacionadas à sua dieta. Com ela, é possível:

- Criar um usuário.
- Identificar o usuário entre as requisições através de cookies.
- Registrar refeições com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Indicação se está dentro ou fora da dieta.
- Editar uma refeição, alterando qualquer uma das informações acima.
- Apagar uma refeição.
- Listar todas as refeições de um usuário.
- Visualizar os detalhes de uma refeição específica.
- Recuperar métricas do usuário, como:
  - Quantidade total de refeições registradas.
  - Quantidade total de refeições dentro da dieta.
  - Quantidade total de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.

Além disso, a API garante que cada usuário só pode visualizar, editar ou apagar as refeições que ele mesmo criou.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução JavaScript fora do navegador.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Fastify**: Framework web rápido e eficiente para Node.js.
- **Knex.js**: Query builder para interagir com o banco de dados.
- **SQLite**: Banco de dados leve e eficiente.
- **Zod**: Biblioteca para validação de dados.
- **Vitest**: Framework de testes para garantir a qualidade do código.

## Rotas da API

- `POST /users`: Cria um novo usuário.
- `POST /meals`: Registra uma refeição para o usuário autenticado.
- `PUT /meals/:id`: Edita uma refeição existente.
- `DELETE /meals/:id`: Apaga uma refeição.
- `GET /meals`: Lista todas as refeições do usuário autenticado.
- `GET /meals/:id`: Visualiza uma refeição específica.
- `GET /meals/metrics`: Recupera as métricas do usuário autenticado.

## Como executar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/chriskryon/rocketseat-ignite-nodejs-files/tree/main/02-challenge
   cd 02-challenge
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` e preencha as informações necessárias.

4. Execute as migrações do banco de dados:
   ```bash
   npm run knex migrate:latest
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

6. Execute os testes:
   ```bash
   npm test
   ```

## Conclusão

Este projeto foi desenvolvido para consolidar os conhecimentos em Node.js, Fastify, TypeScript, SQLite e boas práticas de desenvolvimento de APIs RESTful. Ele atende a todos os requisitos do desafio e foi testado para garantir sua funcionalidade e robustez.

Sinta-se à vontade para explorar o código e utilizar a API como base para outros projetos!