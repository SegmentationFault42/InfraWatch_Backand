**Módulo robusto para testes de conectividade ICMP via API REST**

</div>

---

## 📋 **Índice**

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [API Endpoints](#api-endpoints)
- [Arquitetura](#arquitetura)
- [Funções Principais](#funções-principais)
- [Testes](#testes)
- [Exemplos de Uso](#exemplos-de-uso)
- [Performance](#performance)

---

## 🎯 **Visão Geral**

O módulo de Ping do InfraWatch fornece uma API REST moderna e eficiente para testes de conectividade ICMP. Projetado com foco em performance e confiabilidade, oferece validação robusta e execução paralela para múltiplos hosts.

### **Características Principais**

- ✅ **Ping único ou em lote** - Teste um ou múltiplos hosts simultaneamente
- ✅ **Validação inteligente** - Suporte para IPv4 e domínios
- ✅ **Configuração flexível** - Timeouts e retentativas personalizáveis
- ✅ **Performance otimizada** - Execução paralela com controle de concorrência
- ✅ **Respostas padronizadas** - JSON estruturado e consistente

---

## ✨ **Funcionalidades**

| Funcionalidade             | Descrição                                  | Status |
| :------------------------- | :----------------------------------------- | :----: |
| **Ping Único**             | Testa conectividade com um host específico |   ✅   |
| **Ping em Lote**           | Executa múltiplos pings simultaneamente    |   ✅   |
| **Validação de Hosts**     | IPv4 e resolução de domínios               |   ✅   |
| **Timeouts Configuráveis** | Controle fino sobre tempo de resposta      |   ✅   |
| **Retentativas**           | Sistema de retry para hosts instáveis      |   ✅   |
| **Métricas de Latência**   | Medição precisa de tempo de resposta       |   ✅   |

---

## 🚀 **Instalação**

### **Pré-requisitos**

- Node.js ≥ 16.0.0
- npm ou yarn

### **Dependências**

```bash
npm install ping fastify zod
Instalação Completa
bash# Clone o repositório
git clone https://github.com/SegmentationFault42/InfraWatch.git

# Navegue para o diretório backend
cd InfraWatch/backend

# Instale as dependências
npm install

# Execute os testes
npm test

# Inicie o servidor
npm start

⚙️ Configuração
Registro das Rotas
typescript// app.ts
import { pingRoutes } from './routes/ping.routes';

// Registra o módulo de ping
app.register(pingRoutes);
Configurações Padrão
typescriptconst defaultOptions = {
  timeout: 5000,      // 5 segundos
  attempts: 3,        // 3 tentativas
  concurrency: 5,     // 5 pings simultâneos
  interval: 1000      // 1 segundo entre tentativas
};

🌐 API Endpoints
GET /ping/:host
Executa teste de conectividade para um ou múltiplos hosts.
Parâmetros
ParâmetroTipoDescriçãoExemplohoststringHost(s) separados por vírgulagoogle.com,8.8.8.8
Query Parameters (Opcionais)
ParâmetroTipoPadrãoDescriçãotimeoutnumber5000Timeout em millisegundosattemptsnumber3Número de tentativasconcurrencynumber5Pings simultâneos
Respostas
<details>
<summary><strong>✅ 200 OK - Sucesso</strong></summary>
json[
  {
    "target": "google.com",
    "alive": true,
    "latency": 12.3,
    "attempts": 1,
    "timestamp": "2025-01-15T10:30:00.000Z"
  },
  {
    "target": "8.8.8.8",
    "alive": true,
    "latency": 8.7,
    "attempts": 1,
    "timestamp": "2025-01-15T10:30:00.100Z"
  }
]
</details>
<details>
<summary><strong>❌ 400 Bad Request - Erro de Validação</strong></summary>
json{
  "error": "Validation Error",
  "message": "Host inválido: 'invalid-host-format'",
  "statusCode": 400
}
</details>
<details>
<summary><strong>⚠️ 500 Internal Server Error</strong></summary>
json{
  "error": "Internal Server Error",
  "message": "Erro interno do servidor",
  "statusCode": 500
}
</details>

🏗️ Arquitetura
O módulo segue uma arquitetura em camadas bem definida:
mermaidgraph TB
    A[🌐 Cliente HTTP] --> B[📡 Rota /ping]
    B --> C[🎛️ Controller/Handler]
    C --> D[⚡ Serviço de Ping]
    D --> E[🔧 Utilitários]

    B --> F[✅ Validação Zod]
    D --> G[🔄 Execução Paralela]
    D --> H[⏱️ Timeout & Retry]
Camadas
CamadaArquivoResponsabilidadeRotaping.routes.tsRecebe requisições e valida parâmetrosControllerping.handler.tsOrquestra chamadas e trata errosServiçoping.service.tsLógica de negócio e execuçãoUtilitáriosping.utils.tsFunções auxiliares e validações

🔧 Funções Principais
Serviço de Ping (ping.service.ts)
pingHost(target: string, options?: PingOptions)
typescript/**
 * Testa conectividade com um host específico
 * @param target - IP ou domínio para testar
 * @param options - Configurações de timeout, retentativas, etc.
 * @returns Promise<PingResult> - Resultado do teste
 * @throws PingError - Quando host é inalcançável
 */
pingMultipleHosts(targets: string[], options?: PingOptions)
typescript/**
 * Executa testes em múltiplos hosts simultaneamente
 * @param targets - Array de IPs/domínios
 * @param options.concurrency - Número de pings simultâneos (padrão: 5)
 * @returns Promise<PingResult[]> - Array de resultados
 */
Utilitários (ping.utils.ts)
FunçãoDescriçãomergePingOptions()Combina opções com padrões e validagetTimestamp()Retorna timestamp ISO atualvalidateHost()Valida formato de host/IPparseHostList()Processa lista de hosts separada por vírgula

🧪 Testes
Executar Testes
bash# Todos os testes
npm test
Cobertura de Testes
✅ Cenários Testados:

Hosts válidos e inválidos
Timeouts e retentativas
Formato das respostas
Execução paralela
Tratamento de erros
Validação de parâmetros

File                Coverage
─────────────────────────────
ping.service.ts     97.3%
ping.routes.ts      95.1%
ping.utils.ts       98.7%
─────────────────────────────
Total               96.8%

💡 Exemplos de Uso
Ping Único
bashcurl "http://localhost:3333/ping/google.com"
Resposta:
json[
  {
    "target": "google.com",
    "alive": true,
    "latency": 12.3,
    "attempts": 1,
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
]
Ping Múltiplos Hosts
bashcurl "http://localhost:3333/ping/google.com,8.8.8.8,cloudflare.com"
Com Parâmetros Personalizados
bashcurl "http://localhost:3333/ping/google.com?timeout=3000&attempts=5"
Usando JavaScript
javascript// Exemplo com fetch API
const response = await fetch('http://localhost:3333/ping/google.com,8.8.8.8');
const results = await response.json();

console.log(results);
// [
//   { target: "google.com", alive: true, latency: 12.3, ... },
//   { target: "8.8.8.8", alive: true, latency: 8.7, ... }
// ]
Exemplo com Axios
javascriptimport axios from 'axios';

const pingHosts = async (hosts) => {
  try {
    const { data } = await axios.get(`/ping/${hosts.join(',')}`);
    return data.filter(result => result.alive);
  } catch (error) {
    console.error('Erro ao fazer ping:', error);
    return [];
  }
};

// Uso
const onlineHosts = await pingHosts(['google.com', '8.8.8.8', 'github.com']);
```
