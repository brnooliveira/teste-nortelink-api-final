# 📚 NorteLink - Sistema de Gerenciamento de Livros

API RESTful para gerenciamento de biblioteca pessoal desenvolvida com NestJS, TypeScript e PostgreSQL.

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- npm
- Docker e Docker Compose

### Instalação

1. **Clone o repositório:**

```bash
git clone <repository-url>
cd test-nortelink
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nortelink

# JWT
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_EXPIRATION=99999999999999999

# Application
PORT=3000
```

4. **Inicie o banco de dados:**

```bash
docker-compose up -d
```

5. **Execute as migrations (se houver):**

```bash
npm run migration:run
```

6. **Inicie a aplicação:**

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:3000`

## 📝 Scripts Disponíveis

```bash
npm run start          # Inicia a aplicação
npm run start:dev      # Modo desenvolvimento (watch)
npm run start:prod     # Modo produção
npm run build          # Compila o projeto
npm run lint           # Executa o linter
npm run format         # Formata o código
npm run test           # Executa os testes
```

## 🔌 Endpoints Principais

### Autenticação

```
POST   /auth/login          - Login
POST   /auth/refresh-token  - Renovar token
GET    /auth/profile        - Perfil do usuário
```

### Usuários (requer autenticação)

```
POST   /usuarios            - Criar usuário
GET    /usuarios            - Listar usuários (paginação)
GET    /usuarios/:id        - Obter usuário
PUT    /usuarios/:id        - Atualizar usuário
DELETE /usuarios/:id        - Remover usuário
```

### Autores (requer autenticação)

```
POST   /autores             - Criar autor
GET    /autores             - Listar autores (paginação)
GET    /autores/:id         - Obter autor
PUT    /autores/:id         - Atualizar autor
DELETE /autores/:id         - Remover autor
```

### Assuntos (requer autenticação)

```
POST   /assuntos            - Criar assunto
GET    /assuntos            - Listar assuntos (paginação)
GET    /assuntos/:id        - Obter assunto
PUT    /assuntos/:id        - Atualizar assunto
DELETE /assuntos/:id        - Remover assunto
```

### Livros (requer autenticação)

```
POST   /livros              - Criar livro
GET    /livros              - Listar livros (paginação + filtros)
GET    /livros/:id          - Obter livro
PUT    /livros/:id          - Atualizar livro
POST   /livros/:id/imagem   - Upload de capa
DELETE /livros/:id          - Remover livro
```

## 🧪 Testando a API

### 1. Faça login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com", "senha": "SuaSenha123!"}'
```

### 2. Use o token nas requisições

```bash
curl -X GET http://localhost:3000/livros \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📦 Stack Tecnológica

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem
- **PostgreSQL** - Banco de dados
- **TypeORM** - ORM
- **JWT** - Autenticação
- **Passport** - Autenticação
- **Bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos
- **Class Validator** - Validações

## 🗄️ Banco de Dados

O projeto usa PostgreSQL. O Docker Compose já configura tudo automaticamente.

Para acessar o banco diretamente:

```bash
docker exec -it test-nortelink-db psql -U postgres -d nortelink
```

## 📁 Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── usuarios/       # Gestão de usuários
├── autores/        # Gestão de autores
├── assuntos/       # Gestão de assuntos
├── livros/         # Gestão de livros
├── common/         # Recursos compartilhados
├── config/         # Configurações
└── main.ts         # Ponto de entrada
```

## 🔒 Autenticação

Todas as rotas (exceto `/auth/login` e `/auth/refresh-token`) requerem autenticação JWT.

**Header necessário:**

```
Authorization: Bearer {seu-token-jwt}
```

## 📄 Licença

UNLICENSED
