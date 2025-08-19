# 📑 Documentação do Banco de Dados — Monitoramento & SLA

Este documento descreve a estrutura da base de dados definida em `schema.sql`.  
O banco foi desenhado para suportar **monitoramento de sistemas**, **gestão de SLA**, **alertas/notificações** e **auditoria**.

---

## 🗂 Estrutura Geral

O banco é composto pelos seguintes módulos:

- **Autenticação & Usuários** → `sessions`, `users`, `api_keys`
- **Monitoramento de Sistemas** → `systems`, `status_logs`, `sla_configs`, `sla_reports`
- **Alertas & Notificações** → `alerts`, `contacts`, `notification_channels`, `notification_rules`, `escalation_policies`, `escalation_steps`
- **Operações & Incidentes** → `maintenance_windows`, `incidents`, `incident_events`
- **Taxonomia & Auditoria** → `tags`, `system_tags`, `audit_logs`

---

## 🔐 Autenticação & Usuários

### `sessions`
- **Finalidade**: armazenar sessões de login (ex.: integração com Express `express-session`).
- **Campos**:
  - `sid`: ID da sessão (PK).
  - `sess`: dados da sessão em JSON.
  - `expire`: validade da sessão.
- **Uso no backend**: leitura/escrita automática via middleware de sessão.

---

### `users`
- **Finalidade**: cadastro de utilizadores (operadores, admins, etc.).
- **Campos-chave**:
  - `id`: UUID.
  - `email`: login (único).
  - `role`: perfil (`viewer`, `admin`, etc.).
  - `deleted_at`: soft delete.
- **Uso no backend**:
  - Autenticação/autorização.
  - Filtrar por `deleted_at IS NULL` para considerar apenas ativos.

---

### `api_keys`
- **Finalidade**: fornecer chaves de API para integrações e agentes externos.
- **Campos-chave**:
  - `key`: chave única.
  - `user_id`: usuário dono da chave.
  - `scopes`: permissões em JSON.
- **Uso no backend**:
  - Autenticar agentes externos.
  - Verificar `revoked_at` para invalidar chaves.

---

## 📡 Monitoramento de Sistemas

### `systems`
- **Finalidade**: catálogo dos sistemas monitorados.
- **Campos-chave**:
  - `monitor_type`: protocolo (`http`, `ping`, etc.).
  - `status`: estado atual (`up`, `down`, `warning`, `unknown`).
  - `is_enabled`: ativa/desativa monitoramento.
  - `created_by`, `updated_by`, `deleted_at`: auditoria e soft delete.
- **Uso no backend**:
  - Configuração de monitoramento.
  - Relação com métricas, alertas e relatórios.

---

### `status_logs`
- **Finalidade**: histórico das checagens realizadas.
- **Campos-chave**:
  - `system_id`: referência ao sistema.
  - `status`: resultado da checagem.
  - `response_time`, `status_code`, `error_message`: métricas detalhadas.
- **Uso no backend**:
  - Dashboard de saúde em tempo real.
  - Base para cálculo de SLA.

---

### `sla_configs`
- **Finalidade**: configurações de SLA por sistema.
- **Campos-chave**:
  - `uptime_target`: meta de disponibilidade (%).
  - `response_time_target`: tempo de resposta alvo.
  - `alert_on_sla_violation`: se dispara alertas.
- **Uso no backend**:
  - Definir regras para cálculo automático de violações SLA.

---

### `sla_reports`
- **Finalidade**: relatórios mensais de SLA (agregados).
- **Campos-chave**:
  - `uptime_percentage`, `average_response_time`, `total_downtime`.
- **Uso no backend**:
  - Geração de relatórios mensais.
  - Exibição em dashboards executivos.

---

## 🚨 Alertas & Notificações

### `alerts`
- **Finalidade**: instâncias de alertas disparados.
- **Campos-chave**:
  - `system_id`: sistema monitorado.
  - `severity`: criticidade (`critical`, `warning`, `info`).
  - `status`: estado (`active`, `resolved`, `acknowledged`).
  - `acknowledged_by`, `acknowledged_at`, `resolved_at`: ciclo de vida.
- **Uso no backend**:
  - Criar quando SLA ou checagem falhar.
  - Alterar status conforme ação do usuário.

---

### `contacts`
- **Finalidade**: contatos individuais para notificação.
- **Campos-chave**:
  - `user_id`: se associado a um usuário interno.
  - `channel`: meio de comunicação (`email`, `sms`, etc.).
  - `meta`: dados específicos (ex.: webhook URL).
- **Uso no backend**:
  - Destinatários finais dos alertas.

---

### `notification_channels`
- **Finalidade**: canais de notificação configurados (ex.: Slack workspace).
- **Campos-chave**:
  - `type`: tipo (`email`, `slack`, `telegram`...).
  - `config`: credenciais/tokens em JSON.
- **Uso no backend**:
  - Abstração de envio de notificações.
  - Ex.: um canal Slack pode ter várias regras ligadas.

---

### `notification_rules`
- **Finalidade**: regras que definem quando notificar e por qual canal.
- **Campos-chave**:
  - `system_id`: específico de um sistema ou global.
  - `channel_id`: canal vinculado.
  - `min_severity`: severidade mínima.
  - `repeat_minutes`: reenvio periódico.
- **Uso no backend**:
  - Decidir se e para quem um alerta é enviado.

---

### `escalation_policies` & `escalation_steps`
- **Finalidade**: políticas de escalonamento de alertas.
- **Uso no backend**:
  - `escalation_policies`: agrupamento (ex.: “Criticidade Alta”).
  - `escalation_steps`: sequência de contatos, com atraso (`delay_minutes`).
  - Implementar lógica de reenvio/escalonamento.

---

## ⚙️ Operações & Incidentes

### `maintenance_windows`
- **Finalidade**: janelas de manutenção planejadas.
- **Campos-chave**:
  - `system_id`, `start_at`, `end_at`.
- **Uso no backend**:
  - Pausar alertas durante manutenções.
  - Evitar falsos positivos.

---

### `incidents`
- **Finalidade**: registro de incidentes maiores.
- **Campos-chave**:
  - `status`: (`open`, `investigating`, `resolved`, `closed`).
  - `started_at`, `ended_at`.
- **Uso no backend**:
  - Gerir o ciclo de vida de incidentes.
  - Relacionar com eventos e alertas.

---

### `incident_events`
- **Finalidade**: histórico de eventos dentro de um incidente.
- **Campos-chave**:
  - `event_type`: (`alert`, `note`, `status_change`).
  - `message`: detalhes.
- **Uso no backend**:
  - Timeline de ações e atualizações de incidentes.

---

## 🏷 Taxonomia & Auditoria

### `tags` & `system_tags`
- **Finalidade**: categorização de sistemas.
- **Uso no backend**:
  - `tags`: definição de tags (únicas).
  - `system_tags`: associação N:N entre sistemas e tags.
  - Exemplo: agrupar sistemas por “Produção”, “Financeiro”.

---

### `audit_logs`
- **Finalidade**: rastreamento de ações de usuários.
- **Campos-chave**:
  - `action`, `object_type`, `object_id`.
  - `details`: JSON com contexto extra.
- **Uso no backend**:
  - Auditoria e compliance.
  - Exemplo: “Usuário X desativou monitoramento do sistema Y”.

---

## 📌 Boas Práticas para o Backend

- Sempre aplicar **soft delete** verificando `deleted_at IS NULL`.
- Usar **índices criados** (`IDX_*`) para otimizar consultas de dashboards.
- Manter consistência entre:
  - `alerts.status` e `incidents.status`
  - `systems.status` e últimas entradas em `status_logs`
- Registrar toda ação relevante em `audit_logs`.
- Usar `sla_reports` como **tabela derivada** (não gravar diretamente no app, mas via job batch).

---

## ⚡ Como usar o `schema.sql` com Prisma

O arquivo `schema.sql` contém a definição de todas as tabelas do banco de dados. Com ele, você pode criar o banco e utilizar o **Prisma** para gerenciar dados, realizar consultas e executar migrações.

### 1. Criar o banco a partir do `schema.sql`
Você pode executar o script SQL diretamente no seu servidor MySQL/PostgreSQL:

```bash
# Exemplo para MySQL
mysql -u seu_usuario -p seu_banco < prisma/schema.sql

### Configurar o Prisma
- prisma/schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

### .env:
DATABASE_URL="mysql://usuario:senha@localhost:3306/seu_banco"

### Gerar Prisma Client:
npx prisma generate

### Criar Migração (Opcional):
npx prisma migrate dev --name init

### Usar Prisma Client no Código:

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Exemplo de consulta
const users = await prisma.users.findMany();
console.log(users);