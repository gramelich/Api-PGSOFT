# Documentação Completa - API PGSOFT

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Arquitetura](#arquitetura)
6. [Banco de Dados](#banco-de-dados)
7. [Endpoints da API](#endpoints-da-api)
8. [Segurança](#segurança)
9. [Deploy](#deploy)
10. [Manutenção](#manutenção)

---

## 🎯 Visão Geral

A **Api-PGSOFT** é uma API REST desenvolvida para simular jogos de cassino online do tipo slot machines, inspirada nos jogos da PG Soft. Esta API permite a integração de jogos de cassino em plataformas de apostas, sem a necessidade de pagar taxas GGR (Gross Gaming Revenue) para terceiros.

### Principais Características:
- **Clone de 10 jogos populares** da PG Soft
- **Sem taxas GGR**: hospede em sua própria VPS
- **API RESTful** completa
- **Sistema de autenticação** e autorização
- **Gerenciamento de saldo** e transações
- **Histórico de jogadas**
- **RTP (Return to Player)** configurável

---

## 📁 Estrutura do Projeto

```
Api-PGSOFT/
│
├── dist/                    # Código compilado (JavaScript)
├── notas/                   # Anotações e documentação adicional
├── src/                     # Código fonte (TypeScript)
│   ├── controllers/         # Controladores da API
│   ├── models/              # Modelos de dados
│   ├── routes/              # Definição das rotas
│   ├── services/            # Lógica de negócios
│   ├── middlewares/         # Middlewares (auth, validação, etc)
│   ├── config/              # Configurações da aplicação
│   └── utils/               # Funções utilitárias
│
├── .env                     # Variáveis de ambiente
├── .eslintrc.json          # Configuração do ESLint
├── .gitignore              # Arquivos ignorados pelo Git
├── .htaccess               # Configuração Apache (se aplicável)
├── .prettierrc.json        # Configuração do Prettier
├── apidb.sql               # Script SQL do banco de dados
├── package.json            # Dependências e scripts NPM
├── tsconfig.json           # Configuração do TypeScript
└── yarn.lock               # Lock file do Yarn
```

### Descrição dos Diretórios:

#### **`/src`** - Código Fonte
Contém todo o código TypeScript da aplicação:
- **controllers/**: Manipulam as requisições HTTP e chamam os services
- **models/**: Definem a estrutura dos dados e interagem com o banco
- **routes/**: Mapeiam URLs para os controllers
- **services/**: Contêm a lógica de negócio dos jogos
- **middlewares/**: Funções que processam requisições antes dos controllers
- **config/**: Configurações de banco de dados, ambiente, etc
- **utils/**: Funções auxiliares reutilizáveis

#### **`/dist`** - Código Compilado
Código JavaScript gerado a partir do TypeScript, pronto para execução.

#### **`/notas`** - Documentação
Notas técnicas, especificações dos jogos e documentação adicional.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **TypeScript**: Superset tipado do JavaScript
- **Express.js**: Framework web minimalista

### Banco de Dados
- **MySQL/MariaDB**: Sistema de gerenciamento de banco de dados relacional

### Ferramentas de Desenvolvimento
- **ESLint**: Linter para manter código consistente
- **Prettier**: Formatador de código
- **Yarn**: Gerenciador de pacotes

### Dependências Principais (estimadas)
```json
{
  "express": "^4.x.x",
  "mysql2": "^3.x.x",
  "dotenv": "^16.x.x",
  "cors": "^2.x.x",
  "bcrypt": "^5.x.x",
  "jsonwebtoken": "^9.x.x",
  "express-validator": "^7.x.x"
}
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js v16+ instalado
- MySQL/MariaDB instalado
- Yarn ou NPM instalado
- Servidor VPS (para produção)

### Passo 1: Clone o Repositório
```bash
git clone https://github.com/mrdamaia/Api-PGSOFT.git
cd Api-PGSOFT
```

### Passo 2: Instale as Dependências
```bash
yarn install
# ou
npm install
```

### Passo 3: Configure o Banco de Dados

1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE pgsoft_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importe o schema do banco:
```bash
mysql -u seu_usuario -p pgsoft_api < apidb.sql
```

### Passo 4: Configure as Variáveis de Ambiente

Crie/edite o arquivo `.env` na raiz do projeto:

```env
# Configurações do Servidor
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pgsoft_api
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Autenticação
JWT_SECRET=seu_secret_key_super_seguro
JWT_EXPIRES_IN=7d

# Configurações dos Jogos
DEFAULT_RTP=96.5
MIN_BET=0.10
MAX_BET=1000.00

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://seu-site.com

# Logs
LOG_LEVEL=info
```

### Passo 5: Compile o TypeScript
```bash
yarn build
# ou
npm run build
```

### Passo 6: Execute a API

**Modo Desenvolvimento:**
```bash
yarn dev
# ou
npm run dev
```

**Modo Produção:**
```bash
yarn start
# ou
npm start
```

A API estará disponível em `http://localhost:3000`

---

## 🏗️ Arquitetura

### Padrão MVC (Model-View-Controller)

A API segue o padrão MVC adaptado para APIs REST:

```
Requisição HTTP
      ↓
   Middleware (Auth, Validação)
      ↓
   Router (Roteamento)
      ↓
   Controller (Lógica HTTP)
      ↓
   Service (Lógica de Negócio)
      ↓
   Model (Acesso aos Dados)
      ↓
   Banco de Dados
      ↓
   Resposta HTTP
```

### Fluxo de uma Requisição

1. **Requisição**: Cliente envia requisição HTTP
2. **Middleware**: Valida token, permissões, dados
3. **Router**: Direciona para o controller apropriado
4. **Controller**: Processa a requisição HTTP
5. **Service**: Executa lógica de negócio (cálculos do jogo)
6. **Model**: Interage com o banco de dados
7. **Resposta**: Retorna JSON com resultado

### Exemplo de Fluxo - Jogada de Slot

```typescript
// 1. Cliente faz requisição
POST /api/games/fortune-tiger/spin
Headers: { Authorization: "Bearer token123" }
Body: { bet: 1.00, lines: 20 }

// 2. Middleware autentica
authMiddleware verifica token → usuário válido

// 3. Router direciona
POST /games/:gameId/spin → gameController.spin()

// 4. Controller processa
gameController.spin() {
  - Valida gameId
  - Valida bet
  - Chama gameService.playSpin()
}

// 5. Service calcula resultado
gameService.playSpin() {
  - Verifica saldo do usuário
  - Gera símbolos aleatórios (com RTP)
  - Calcula ganhos
  - Atualiza saldo
  - Registra histórico
}

// 6. Model salva dados
userModel.updateBalance()
historyModel.createRecord()

// 7. Resposta retorna
{
  "success": true,
  "result": {
    "symbols": [...],
    "win": 15.50,
    "balance": 234.50
  }
}
```

---

## 🗄️ Banco de Dados

### Estrutura do Banco de Dados (apidb.sql)

O arquivo `apidb.sql` contém a estrutura completa do banco. Principais tabelas:

#### **Tabela: `users`**
Armazena informações dos usuários/jogadores.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'BRL',
  status ENUM('active', 'suspended', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);
```

**Campos:**
- `id`: Identificador único do usuário
- `username`: Nome de usuário único
- `email`: Email único do usuário
- `password_hash`: Hash da senha (bcrypt)
- `balance`: Saldo atual em decimal
- `currency`: Moeda (BRL, USD, EUR, etc)
- `status`: Status da conta (ativo, suspenso, banido)
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

#### **Tabela: `games`**
Catálogo de jogos disponíveis.

```sql
CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  rtp DECIMAL(5, 2) DEFAULT 96.50,
  volatility ENUM('low', 'medium', 'high') DEFAULT 'medium',
  min_bet DECIMAL(10, 2) DEFAULT 0.10,
  max_bet DECIMAL(10, 2) DEFAULT 1000.00,
  max_win DECIMAL(10, 2) DEFAULT 10000.00,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_game_id (game_id)
);
```

**Campos:**
- `game_id`: ID único do jogo (ex: "fortune-tiger")
- `name`: Nome exibido do jogo
- `rtp`: Return to Player (%) - taxa de retorno
- `volatility`: Volatilidade (frequência de prêmios)
- `min_bet`/`max_bet`: Limites de aposta
- `max_win`: Ganho máximo possível
- `active`: Se o jogo está ativo

#### **Tabela: `game_sessions`**
Sessões de jogo dos usuários.

```sql
CREATE TABLE game_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  total_bets INT DEFAULT 0,
  total_wagered DECIMAL(10, 2) DEFAULT 0.00,
  total_won DECIMAL(10, 2) DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_session_id (session_id),
  INDEX idx_user_id (user_id)
);
```

**Campos:**
- `session_id`: ID único da sessão
- `user_id`: Referência ao usuário
- `game_id`: ID do jogo jogado
- `total_bets`: Número de apostas na sessão
- `total_wagered`: Total apostado
- `total_won`: Total ganho

#### **Tabela: `game_history`**
Histórico de todas as jogadas.

```sql
CREATE TABLE game_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  bet_amount DECIMAL(10, 2) NOT NULL,
  win_amount DECIMAL(10, 2) DEFAULT 0.00,
  balance_before DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  game_data JSON,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_played_at (played_at)
);
```

**Campos:**
- `game_data`: JSON com detalhes da jogada (símbolos, linhas vencedoras, etc)
- `balance_before`/`balance_after`: Saldo antes e depois
- Outros campos: auto-explicativos

#### **Tabela: `transactions`**
Todas as transações financeiras.

```sql
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('deposit', 'withdraw', 'bet', 'win', 'bonus') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
);
```

**Tipos de Transação:**
- `deposit`: Depósito
- `withdraw`: Saque
- `bet`: Aposta
- `win`: Ganho
- `bonus`: Bônus

#### **Tabela: `api_keys`**
Chaves de API para integração.

```sql
CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  permissions JSON,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_key_hash (key_hash)
);
```

### Relacionamentos

```
users (1) ─── (N) game_sessions
users (1) ─── (N) game_history
users (1) ─── (N) transactions
users (1) ─── (N) api_keys
game_sessions (1) ─── (N) game_history
```

---

## 🔌 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

### Autenticação

Todos os endpoints (exceto registro e login) requerem autenticação via JWT Bearer Token:
```
Authorization: Bearer seu_token_jwt_aqui
```

---

### 📝 Autenticação e Usuários

#### **POST /auth/register**
Registra um novo usuário.

**Request:**
```json
{
  "username": "jogador123",
  "email": "jogador@example.com",
  "password": "senhaSegura123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "id": 1,
    "username": "jogador123",
    "email": "jogador@example.com",
    "balance": 0.00,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **POST /auth/login**
Faz login e retorna token JWT.

**Request:**
```json
{
  "email": "jogador@example.com",
  "password": "senhaSegura123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "jogador123",
      "email": "jogador@example.com",
      "balance": 150.50
    }
  }
}
```

#### **GET /users/me**
Retorna dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer token_jwt
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "jogador123",
    "email": "jogador@example.com",
    "balance": 150.50,
    "currency": "BRL",
    "status": "active",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

#### **GET /users/balance**
Consulta saldo atual.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": 150.50,
    "currency": "BRL"
  }
}
```

---

### 🎰 Jogos

#### **GET /games**
Lista todos os jogos disponíveis.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "game_id": "fortune-tiger",
      "name": "Fortune Tiger",
      "description": "Jogo de tigre da fortuna",
      "rtp": 96.75,
      "volatility": "high",
      "min_bet": 0.10,
      "max_bet": 1000.00,
      "max_win": 10000.00,
      "active": true
    },
    {
      "game_id": "fortune-ox",
      "name": "Fortune Ox",
      "rtp": 96.50,
      "volatility": "medium",
      "min_bet": 0.20,
      "max_bet": 500.00,
      "max_win": 5000.00,
      "active": true
    }
  ]
}
```

#### **GET /games/:gameId**
Detalhes de um jogo específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "game_id": "fortune-tiger",
    "name": "Fortune Tiger",
    "description": "Jogo de tigre da fortuna com multiplicadores",
    "rtp": 96.75,
    "volatility": "high",
    "min_bet": 0.10,
    "max_bet": 1000.00,
    "max_win": 10000.00,
    "features": [
      "Wilds",
      "Multiplicadores",
      "Rodadas Grátis"
    ],
    "paylines": 20,
    "reels": 5,
    "rows": 3
  }
}
```

#### **POST /games/:gameId/spin**
Executa uma jogada (spin) no jogo.

**Request:**
```json
{
  "bet": 1.00,
  "lines": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "session_id": "sess_abc123xyz",
    "spin_id": "spin_789def456",
    "bet": 1.00,
    "symbols": [
      ["tiger", "wild", "gold"],
      ["gold", "tiger", "tiger"],
      ["tiger", "gold", "wild"],
      ["gold", "tiger", "tiger"],
      ["wild", "gold", "tiger"]
    ],
    "winning_lines": [
      {
        "line": 5,
        "symbols": ["tiger", "tiger", "tiger"],
        "multiplier": 10,
        "win": 10.00
      },
      {
        "line": 12,
        "symbols": ["gold", "gold", "gold"],
        "multiplier": 5,
        "win": 5.00
      }
    ],
    "total_win": 15.00,
    "balance_before": 150.50,
    "balance_after": 164.50,
    "free_spins": 0,
    "multiplier": 1,
    "played_at": "2024-11-04T15:30:00Z"
  }
}
```

**Explicação dos Campos:**
- `symbols`: Matriz 5x3 com os símbolos resultantes
- `winning_lines`: Array de linhas vencedoras
- `total_win`: Soma de todos os ganhos
- `balance_before/after`: Saldo antes e depois da jogada
- `free_spins`: Rodadas grátis ganhas (se houver)
- `multiplier`: Multiplicador aplicado

#### **POST /games/:gameId/demo**
Joga no modo demo (sem dinheiro real).

**Request:**
```json
{
  "bet": 1.00,
  "lines": 20
}
```

**Response:** Mesma estrutura do `/spin`, mas não afeta saldo real.

---

### 📊 Histórico e Sessões

#### **GET /sessions**
Lista sessões de jogo do usuário.

**Query Params:**
- `limit`: Número de resultados (padrão: 20)
- `offset`: Paginação (padrão: 0)
- `game_id`: Filtrar por jogo

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "session_id": "sess_abc123",
        "game_id": "fortune-tiger",
        "game_name": "Fortune Tiger",
        "started_at": "2024-11-04T14:00:00Z",
        "ended_at": "2024-11-04T15:30:00Z",
        "total_bets": 45,
        "total_wagered": 45.00,
        "total_won": 52.50,
        "profit": 7.50
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### **GET /history**
Histórico detalhado de jogadas.

**Query Params:**
- `limit`: Número de resultados (padrão: 50)
- `offset`: Paginação
- `game_id`: Filtrar por jogo
- `session_id`: Filtrar por sessão
- `from_date`: Data início (ISO 8601)
- `to_date`: Data fim (ISO 8601)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": 12345,
        "session_id": "sess_abc123",
        "game_id": "fortune-tiger",
        "bet_amount": 1.00,
        "win_amount": 15.00,
        "balance_before": 150.50,
        "balance_after": 164.50,
        "game_data": {
          "symbols": [...],
          "winning_lines": [...]
        },
        "played_at": "2024-11-04T15:30:00Z"
      }
    ],
    "pagination": {
      "total": 523,
      "limit": 50,
      "offset": 0
    }
  }
}
```

#### **GET /history/:id**
Detalhes de uma jogada específica.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "session_id": "sess_abc123",
    "game_id": "fortune-tiger",
    "game_name": "Fortune Tiger",
    "bet_amount": 1.00,
    "win_amount": 15.00,
    "balance_before": 150.50,
    "balance_after": 164.50,
    "game_data": {
      "symbols": [
        ["tiger", "wild", "gold"],
        ["gold", "tiger", "tiger"],
        ["tiger", "gold", "wild"],
        ["gold", "tiger", "tiger"],
        ["wild", "gold", "tiger"]
      ],
      "winning_lines": [
        {
          "line": 5,
          "symbols": ["tiger", "tiger", "tiger"],
          "multiplier": 10,
          "win": 10.00
        }
      ],
      "free_spins": 0,
      "multiplier": 1
    },
    "played_at": "2024-11-04T15:30:00Z"
  }
}
```

---

### 💰 Transações

#### **POST /transactions/deposit**
Adiciona saldo (simulado - em produção integraria com gateway de pagamento).

**Request:**
```json
{
  "amount": 100.00,
  "method": "pix",
  "description": "Depósito via PIX"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transaction_id": 789,
    "type": "deposit",
    "amount": 100.00,
    "balance_before": 150.50,
    "balance_after": 250.50,
    "status": "completed",
    "created_at": "2024-11-04T16:00:00Z"
  }
}
```

#### **POST /transactions/withdraw**
Solicita saque.

**Request:**
```json
{
  "amount": 50.00,
  "method": "pix",
  "pix_key": "email@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transaction_id": 790,
    "type": "withdraw",
    "amount": 50.00,
    "balance_before": 250.50,
    "balance_after": 200.50,
    "status": "pending",
    "created_at": "2024-11-04T16:15:00Z",
    "estimated_completion": "2024-11-04T18:00:00Z"
  }
}
```

#### **GET /transactions**
Lista transações do usuário.

**Query Params:**
- `type`: Filtrar por tipo (deposit, withdraw, bet, win)
- `limit`: Número de resultados
- `offset`: Paginação

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 790,
        "type": "withdraw",
        "amount": 50.00,
        "balance_before": 250.50,
        "balance_after": 200.50,
        "status": "pending",
        "description": "Saque via PIX",
        "created_at": "2024-11-04T16:15:00Z"
      },
      {
        "id": 789,
        "type": "deposit",
        "amount": 100.00,
        "balance_before": 150.50,
        "balance_after": 250.50,
        "status": "completed",
        "description": "Depósito via PIX",
        "created_at": "2024-11-04T16:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

### 📈 Estatísticas

#### **GET /stats/summary**
Resumo estatístico do usuário.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_wagered": 1250.00,
    "total_won": 1350.50,
    "profit": 100.50,
    "total_bets": 523,
    "win_rate": 42.5,
    "biggest_win": 250.00,
    "favorite_game": {
      "game_id": "fortune-tiger",
      "name": "Fortune Tiger",
      "plays": 245
    },
    "current_streak": {
      "type": "winning",
      "count": 3
    }
  }
}
```

#### **GET /stats/games/:gameId**
Estatísticas de um jogo específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "game_id": "fortune-tiger",
    "name": "Fortune Tiger",
    "total_plays": 245,
    "total_wagered": 650.00,
    "total_won": 702.50,
    "profit": 52.50,
    "biggest_win": 150.00,
    "average_bet": 2.65,
    "win_rate": 45.3,
    "last_played": "2024-11-04T15:30:00Z"
  }
}
```

---

### ⚠️ Códigos de Erro

A API retorna erros padronizados:

**400 - Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "bet",
        "message": "Aposta deve ser maior que 0.10"
      }
    ]
  }
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido ou expirado"
  }
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "
