# 🚀 InfraWatch Backend

Backend do projeto **InfraWatch**, desenvolvido em **Node.js + TypeScript + Prisma**, com integração a PostgreSQL e TimescaleDB.

---

## 📋 Requisitos

- **Node.js** (versão LTS recomendada, ex.: 20+)
- **npm** (vem junto com Node)
- **PostgreSQL** (para dados principais)
- **TimescaleDB** (para séries temporais, roda sobre PostgreSQL)
- **Redis 6.2+** (cache e fila de jobs)
- **Prisma CLI** (instalado via `npm`)

> ⚠️ Se estiver usando **Windows**, recomendamos fortemente o uso do **WSL2 (Ubuntu)** em vez de instalar serviços diretamente no Windows.

---

## ⚙️ Instalação

### 🔹 Linux (Ubuntu/Debian)

1. **Instalar NVM (Node Version Manager)**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
2. **Instalar Node.js LTS**
   ```bash
   nvm install --lts
3. **Instalar dependências**
   ```bash
   npm install
4. **Configurar variáveis de ambiente**
Criar o arquivo .env na raiz do projeto:
   ```bash
   DATABASE_URL="postgres://<user>:<password>@<host>:<port>/<database>"
   TIMESERIES_DATABASE_URL="postgres://<user>:<password>@<host>:<port>/<database>?sslmode=require"
6. **Gerar Prisma Client**
   ```bash
   npx prisma generate
   npx prisma generate --schema=./prisma/timeseries.prisma
7. **Rodar o servidor**
   ```bash
   npm run dev

### 🔹 Windows

✅ Opção recomendada: WSL2 (Ubuntu)
Siga exatamente os passos do Linux dentro do WSL2, pois é muito mais estável para rodar Node + Redis + PostgreSQL.
