# 🏨 Flats Integração - Guia Digital do Hóspede

Bem-vindo ao repositório do **Guia Digital Flats Integração**. Esta aplicação web progressiva (PWA) serve como um concierge digital para os hóspedes, fornecendo informações essenciais (Wi-Fi, senhas), dicas locais e suporte, além de um painel administrativo completo para gestão.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend / Database:** Firebase (Firestore, Auth)
- **Server-Side Logic:** Vercel Serverless Functions (Node.js)
- **IA:** Google Gemini (via API) para sugestões inteligentes
- **Ícones:** Lucide React
- **Testes:** Vitest + React Testing Library
- **Validação:** Zod (API Inputs)

## ✨ Funcionalidades Principais

### 👤 Visão do Hóspede (Guest View)

- **Acesso Seguro:** Senhas de porta e cofre só são liberadas no dia do check-in (validação via servidor).
- **Guia Local:** Dicas de restaurantes, passeios e eventos, gerenciáveis pelo admin.
- **Modo Motorista:** Integração com mapas para facilitar a chegada.
- **Suporte:** Botão direto para WhatsApp do anfitrião com mensagens pré-definidas.
- **Vídeo Drone:** Visualização aérea da localização.

### 🛡️ Painel Administrativo (CMS)

- **Gestão de Reservas:** Criação e visualização de reservas com links únicos (`?rid=...`).
- **Gerenciador de Conteúdo:** Adicione/Edite restaurantes, dicas e curiosidades em tempo real.
- **Configurações Globais:** Altere senha do Wi-Fi, avisos de manutenção e prompts da IA.
- **Upload de Imagens:** Gerenciamento de imagens de capa e locais.

### 📈 Copiloto Financeiro (Calculadora Local)

- **Controle de Fluxo de Caixa:** Lançamento de ganhos diários líquidos com teclado numérico (Numpad) customizado.
- **Termômetro de Risco:** Previsão de saldo simulada baseada em metas financeiras e ritmos diários.
- **Gestão de Compromissos:** Cadastro de despesas com controle de recorrência semanal automatizado.

---

## 🛠️ Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- Conta no Firebase
- Conta na Vercel (para deploy e serverless functions)

### 1. Instalação

```bash
npm install
```

### 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz com as chaves do Firebase e Gemini:

```env
# Firebase Client (Frontend)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Firebase Admin (Server-Side - Vercel)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="...sua-chave-privada..."

# Google Gemini AI
GEMINI_API_KEY=...

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=...
```

### 3. Rodando Localmente

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`.

> **Nota:** As funções de servidor (`/api/*`) requerem o ambiente Vercel (`vercel dev`) para funcionarem localmente com perfeição, ou podem ser mockadas.

### 4. Rodando Testes

```bash
npm test
```

Isso executará a suíte de testes unitários (Vitest) para hooks e utilitários.

---

## 🔒 Segurança, Qualidade & SEO

### Segurança

A aplicação implementa **Server-Side Sanitization** para dados sensíveis.

- O frontend **NUNCA** recebe a senha da porta antes do check-in.
- A API `/api/get-guest-config` valida a data no servidor (Timezone: America/Sao_Paulo) antes de retornar os segredos.
- Validação rigorosa de inputs com **Zod** em todas as APIs.
- Proteção antispam e Rate Limiting (Vercel KV / in-memory fallback) para proteção contra ataques de força bruta.

### Qualidade de Código & SEO Engine

- **Testes Unitários:** Cobertura de testes expressiva para toda a lógica crítica de negócios (ex: cálculo de datas de estadia) com Vitest.
- **SEO & SSR Engine:** Pipeline de build avançado (`npm run build`) que realiza _prerendering_ estático, minificação e otimização de CSS crítico, otimização de imagens em lote via `sharp` e geração automatizada de sitemaps.
- **Automação Externa:** Workflows em n8n (templates integrados) para briefing matinal de equipes e envio automático de links de acesso por WhatsApp via Z-API.

---

## 📂 Estrutura do Projeto

- `/src`: Código fonte React (Frontend).
    - `/components`: Componentes UI (GuestView, AdminDashboard, etc).
    - `/services`: Integração com Firebase Client.
    - `/hooks`: Lógica de estado e efeitos.
    - `/pages`: Roteamento e artigos do Blog.
- `/api`: Vercel Serverless Functions (Backend).
    - `get-guest-config.ts`: Endpoint seguro e higienizado para dados da reserva.
    - `ai-chat.ts`: Chatbot integrado com o Google Gemini.
    - `create-payment.ts`: Integração nativa com Mercado Pago.
    - `translate.ts` & `tts.ts`: Tradução dinâmica e Text-to-Speech nativo.

## 🚀 Deploy

O projeto é otimizado para **Vercel**.

1. Conecte o repositório GitHub à Vercel.
2. Configure as variáveis de ambiente no painel da Vercel.
3. O deploy é automático a cada push na `main`.

---

Desenvolvido com ❤️ para Flats Integração.
