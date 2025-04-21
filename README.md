# TaskUp — Gerenciador de Tarefas (Back-End)

Bem-vindo ao **TaskUp**, uma API simples, segura e eficiente para gerenciamento de tarefas pessoais!  
Desenvolvido com foco em boas práticas, autenticação JWT e criptografia de senha.

---

## 📌 Tecnologias Utilizadas

- **Node.js** — Ambiente JavaScript para backend.
- **Express.js** — Framework web minimalista.
- **Prisma ORM** — Mapeamento objeto-relacional para banco de dados MySQL.
- **MySQL** — Banco de dados relacional.
- **JWT (JSON Web Token)** — Autenticação via token.
- **crypto** — Criptografia de senha com SHA-256.
- **dotenv** — Variáveis de ambiente seguras.

---

## ⚙️ Funcionalidades

- 🤖 Cadastro de usuários com senha criptografada.
- 🔐 Login seguro com geração de token JWT.
- 📋 Criação de tarefas associadas ao usuário logado.
- 🗓️ Classificação automática de tarefas:
  - **Pendente**
  - **Atrasada**
  - **Concluída**
- ✅ Atualização de status para "Concluída".
- 🔒 Proteção de rotas com autenticação JWT.
- 🧐 Middleware para validação de token.

---

## 💡 Boas Práticas Aplicadas

- Código claro, modular e bem organizado.
- Hash de senha com `SHA-256` para segurança.
- Proteção de endpoints sensíveis via token.
- Padronização de respostas HTTP (`200`, `201`, `400`, `401`, `403`).
- Organização de dados com `Prisma` e MySQL.
- Uso de variáveis de ambiente com `dotenv` (segurança garantida).

---

## 🛠️ Como rodar o projeto

### Pré-requisitos:
- Node.js
- MySQL

### Passos:

1️⃣ Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

2️⃣ Instale as dependências:
```bash
npm install
```

3️⃣ Configure seu `.env`:
```env
TOKEN=seu_token_jwt_secreto
DATABASE_URL="mysql://usuario:senha@localhost:3306/taskup"
```

4️⃣ Execute as migrations do banco:
```bash
npx prisma migrate dev
```

5️⃣ Inicie o servidor:
```bash
npm run dev
```

A aplicação estará disponível em:
```
http://localhost:3000
```

---

## 📬 Endpoints Principais

| Método | Rota              | Descrição                        | Necessário Token |
|--------|--------------------|-----------------------------------|-------------------|
| POST   | `/register`        | Registro de novo usuário         | ❌ Não            |
| POST   | `/login`           | Login e geração de token         | ❌ Não            |
| POST   | `/create-task`     | Cria uma nova tarefa             | ✅ Sim            |
| GET    | `/`                | Lista tarefas pendentes, atrasadas e concluídas | ✅ Sim        |
| POST   | `/completed-task`  | Marca tarefa como concluída      | ✅ Sim            |

---

## 💻 Exemplo de Requisição com Token

```http
POST /create-task
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "titulo": "Estudar Node.js",
  "descricao": "Finalizar curso de Node",
  "prioridade": "Alta",
  "prazo": "2025-05-01T23:59:00Z"
}
```

---

## ⚡ Conclusão

Esse projeto foi desenvolvido respeitando conceitos modernos de segurança, organização e clareza, ideal para evoluir, escalar e integrar com front-ends diversos.  
Fácil de entender, simples de expandir!

---

📌 **Sinta-se livre pra clonar, usar e melhorar!**

