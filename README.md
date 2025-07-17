# API de Tokens OTP (One-Time Password)

Este projeto implementa uma API REST para gerenciamento de tokens OTP (senhas de uso único), seguindo os princípios da Arquitetura Hexagonal.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Requisitos](#requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
  - [Com Docker](#com-docker)
  - [Localmente](#localmente)
- [Testes](#testes)
- [Decisões Técnicas](#decisões-técnicas)
- [Considerações de Segurança](#considerações-de-segurança)
- [Escalabilidade](#escalabilidade)

## Visão Geral

Esta API permite a criação e validação de tokens OTP (One-Time Password), que são senhas numéricas de uso único, geralmente utilizadas como segundo fator de autenticação ou para confirmar operações sensíveis.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução
- **TypeScript**: Linguagem de programação
- **NestJS**: Framework para construção de aplicações escaláveis
- **Redis**: Banco de dados NoSQL para armazenamento de tokens
- **Docker**: Containerização
- **Jest**: Framework de testes
- **Swagger/OpenAPI**: Documentação da API
- **bcrypt**: Biblioteca para hashing seguro

## Arquitetura

O projeto segue os princípios da Arquitetura Hexagonal (também conhecida como Ports and Adapters), que promove a separação de responsabilidades e a independência do domínio em relação a tecnologias externas.

### Estrutura de Diretórios
src/
├── common/ # Componentes compartilhados
├── config/ # Configurações da aplicação
├── token-otp/ # Módulo principal
│ ├── adapters/ # Adaptadores (controllers, repositories)
│ │ ├── controllers/ # Controladores da API
│ │ ├── infrastructure/ # Implementações de infraestrutura
│ │ ├── model/ # DTOs e mapeadores
│ │ ├── repositories/ # Implementações de repositórios
│ │ └── services/ # Serviços de adaptadores
│ ├── domain/ # Lógica de domínio
│ │ ├── model/ # Entidades de domínio
│ │ └── ports/ # Portas (interfaces)
│ │     ├── input/ # Portas de entrada
│ │     └── output/ # Portas de saída
│ └── token-otp.module.ts # Módulo NestJS
└── main.ts # Ponto de entrada da aplicação


## Requisitos

- Node.js 18+
- Docker e Docker Compose (opcional, para execução containerizada)
- Redis (instalado localmente ou via Docker)

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Leonardo-almd/btg-otp-challenge
   cd btg-otp-challenge
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` baseado no `env-example.txt`:
   ```bash
   cp env-example.txt .env
   ```
   - Ajuste as variáveis conforme necessário:
   ```
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   THROTTLE_TTL=5000
   THROTTLE_LIMIT=3
   ```

## Executando a Aplicação

### Com Docker

1. Construa e inicie os containers:
   ```bash
   docker compose up --build
   ```

2. A API estará disponível em `http://localhost:8080/api`
3. A documentação Swagger estará disponível em `http://localhost:8080/api/docs`

### Localmente

1. Certifique-se de que o Redis está em execução:
   ```bash
   redis-server
   ```

2. Inicie a aplicação:
   ```bash
   npm run start:dev
   ```

3. A API estará disponível em `http://localhost:3000/api`
4. A documentação Swagger estará disponível em `http://localhost:3000/api/docs`

## Testes

O projeto inclui testes unitários e end-to-end (e2e):

```bash
# Executar todos os testes unitários
npm test

# Executar testes com watch mode
npm run test:watch

# Executar testes com cobertura
npm run test:cov

# Executar testes e2e
npm run test:e2e
```

## Decisões Técnicas

### Arquitetura Hexagonal

Optamos pela Arquitetura Hexagonal para:
- Isolar o domínio da aplicação de detalhes de infraestrutura
- Facilitar a testabilidade através da inversão de dependências
- Permitir a substituição de componentes externos (como o banco de dados) com impacto mínimo

### Redis como Banco de Dados

Escolhemos o Redis pelos seguintes motivos:
- Performance: Operações extremamente rápidas, essenciais para autenticação
- TTL nativo: Suporte integrado para expiração de chaves, ideal para tokens temporários
- Simplicidade: Fácil configuração e uso para o caso específico de tokens OTP


## Considerações de Segurança

- Os tokens OTP são armazenados em formato hash no Redis
- Implementamos rate limiting para prevenir ataques de força bruta
- Validação rigorosa de todas as entradas para prevenir injeções
- Logs estruturados sem informações sensíveis

## Escalabilidade

O projeto foi projetado considerando escalabilidade em vários níveis:

- **Infraestrutura distribuída com Docker Compose**:
  - Separação clara entre serviços (API, Redis, Nginx)
  - Configuração de rede isolada para comunicação entre serviços
  - Possibilidade de escalar cada serviço independentemente
  - Facilidade para adicionar novos serviços ou réplicas conforme necessário

- **Benefícios da Arquitetura Hexagonal para escalabilidade**:
  - Desacoplamento entre domínio e infraestrutura facilita a distribuição de componentes
  - Interfaces bem definidas permitem substituir implementações por versões mais escaláveis
  - Separação clara de responsabilidades facilita a identificação de gargalos

- **Tecnologias escaláveis**:
  - **Redis** com suporte a clustering para alta disponibilidade e particionamento de dados
  - **Proxy reverso com Nginx** para balanceamento de carga e terminação SSL
  - **NestJS** com suporte a processamento assíncrono e não-bloqueante

- **Práticas de DevOps**:
  - Containerização com Docker para facilitar o deployment em ambientes de nuvem
  - Configurações externalizadas via variáveis de ambiente
  - Monitoramento de performance através de logs estruturados

Esta abordagem de infraestrutura distribuída, combinada com os princípios da arquitetura hexagonal, proporciona uma base sólida para o crescimento da aplicação, permitindo escalar horizontalmente (adicionando mais instâncias) ou verticalmente (aumentando recursos) conforme a demanda.

