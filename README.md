<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# BTG OTP Challenge

API REST para gerenciamento de tokens OTP (One-Time Password) desenvolvida com NestJS e Arquitetura Hexagonal.

## Descrição

Este projeto implementa uma API para criar e validar tokens OTP, seguindo os princípios da Arquitetura Hexagonal (também conhecida como Ports and Adapters).

## Estrutura do Projeto

A estrutura do projeto segue os princípios da Arquitetura Hexagonal:

```
src/
  modules/
    otp/
      application/
        ports/           # Interfaces (portas) para adaptadores externos
        use-cases/       # Casos de uso da aplicação
      domain/
        entities/        # Entidades de domínio
        services/        # Serviços de domínio
      infrastructure/
        adapters/        # Adaptadores para serviços externos
        controllers/     # Controladores HTTP
        repositories/    # Implementações de repositórios
```

## Funcionalidades Implementadas

- [x] Criação de token OTP
- [ ] Validação de token OTP

## Endpoints

### 1. Criar token OTP

```
POST /otp
```

**Corpo da requisição:**
```json
{
  "userId": "string"
}
```

**Resposta:**
```json
{
  "token": "string",
  "expiresAt": "date"
}
```

## Como executar

1. Instale as dependências:
```bash
npm install
```

2. Execute a aplicação:
```bash
npm run start:dev
```

3. A API estará disponível em `http://localhost:3000`

## Tecnologias utilizadas

- NestJS
- TypeScript
- Arquitetura Hexagonal
