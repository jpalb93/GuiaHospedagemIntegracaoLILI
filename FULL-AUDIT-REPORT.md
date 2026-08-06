# Relatório de Auditoria de SEO — Flats Integração

- **URL do Site:** `https://flatsintegracao.com.br/`
- **Data da Auditoria:** 2026-06-29 (Horário Local)
- **Escopo:** Apenas o site público de marketing (`https://flatsintegracao.com.br/` e artigos do guia público). O sistema interno de guia de hóspedes, a calculadora e a área administrativa estão **explicitamente fora do escopo** desta auditoria de SEO.
- **Pontuação Geral Derivada:** **30/100** (Classificação: **Necessita de Melhorias**)
- **Confiança na Pontuação:** **Média** (Devido à indisponibilidade de dados da API do PageSpeed por limite de cota).

---

## A) Resumo da Auditoria

### Principais Constatações
- O site possui excelentes títulos e metadados básicos em termos de palavras-chave, mas carece de elementos técnicos estruturais fundamentais, como links canônicos e dados estruturados Schema JSON-LD.
- **Bugs de Compilação de Espaço em Branco (Importante):** Foram identificados múltiplos erros de ortografia/espaçamento em tags de cabeçalho (`H1` e `H2`) causados pela quebra de linha com tags `<br />` no React. Isso afeta a legibilidade e o entendimento das entidades pelos mecanismos de pesquisa (ex: `"Petrolinapor"`, `"porquem"`, `"PetrolinaCentro"`).
- **Escopo de Área Privada:** Identificamos que as páginas apontadas pelas ferramentas de automação como "órfãs" (sem links internos diretos no site principal) são, na verdade, partes do guia de hóspedes privado e da calculadora, o que valida as diretrizes do usuário de mantê-los separados do escopo de rastreamento do site de marketing.

### Top 3 Problemas Críticos
1. **Ausência de Tag Canônica:** O site não possui a tag `<link rel="canonical">` na homepage, criando risco de duplicação de conteúdo entre as versões com e sem `www`.
2. **Ausência de Dados Estruturados Schema JSON-LD:** Não há qualquer marcação Schema (como `LocalBusiness` ou `Organization`) para declarar a empresa, suas avaliações excelentes (ex: nota 9.0 no Booking) e serviços.
3. **Ausência de Cabeçalhos de Segurança HTTP:** O site apresenta uma postura de segurança frágil com 5 cabeçalhos essenciais em falta (CSP, X-Frame-Options, etc.), o que impacta negativamente a confiabilidade percebida pelo Google (Trust factor).

### Top 3 Oportunidades
1. **Correção de Spacing typos no JSX:** Corrigir a concatenação de strings ao redor de tags `<br />` nos arquivos React da pasta `src/components/LandingFlats/` para separar os termos de cabeçalho corretamente.
2. **Implementação de Marcação LocalBusiness JSON-LD:** Declarar os flats, endereço no centro de Petrolina, o link e avaliações do Booking no código para habilitar Rich Snippets nos resultados do Google.
3. **Canonicalização via Redirecionamento 301 Permanente:** Substituir o redirecionamento temporário 307 de `flatsintegracao.com.br` para `www.flatsintegracao.com.br` por um 301 Permanente nas configurações do servidor/hospedagem para preservar a autoridade de link (link equity).

---

## B) Tabela de Constatações (Findings Table)

| Área | Severidade | Confiança | Constatação (Problema) | Evidência (Prova) | Correção Sugerida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Technical SEO** | 🔴 Crítico | Confirmado | Ausência de link canônico na página principal. | Código-fonte da homepage não possui tag `<link rel="canonical">`. | Adicionar `<link rel="canonical" href="https://www.flatsintegracao.com.br/" />` na tag `<head>`. |
| **Schema** | 🔴 Crítico | Confirmado | Ausência de dados estruturados JSON-LD. | `"schema": []` retornado no analisador HTML da homepage. | Criar e injetar código JSON-LD do tipo `LocalBusiness` e `Organization` declarando os flats e avaliações. |
| **Security** | 🔴 Crítico | Confirmado | Ausência de 5 cabeçalhos de segurança HTTP essenciais. | Faltando: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. | Adicionar esses cabeçalhos no arquivo de configuração do servidor (`vercel.json` ou `firebase.json`). |
| **On-Page SEO** | ⚠️ Aviso | Confirmado | Erro de espaçamento/digitação no H1 principal devido ao JSX. | `H1` renderiza como `"Hospedagem em Petrolinapor Temporada"`. | Ajustar o arquivo [Hero.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/Hero.tsx#L104) para incluir um espaço explícito antes/depois do `<br />`. |
| **On-Page SEO** | ⚠️ Aviso | Confirmado | Erros de espaçamento/digitação em múltiplos cabeçalhos H2. | Renderizando: `"Aprovado porquem viveu."`, `"PetrolinaCentro"`, `"O Melhor Flat em Petrolinapara Sua Estadia"`, `"Sua Hospedagem em Petrolina:O que você precisa saber"`. | Ajustar espaçamentos nos arquivos JSX correspondentes (ex: [ReputationSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/ReputationSection.tsx#L121), [LocationSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/LocationSection.tsx#L93), [FeaturesSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/FeaturesSection.tsx#L73), e [InfoSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/InfoSection.tsx#L97)). |
| **On-Page SEO** | ⚠️ Aviso | Confirmado | Meta Descrição está curta. | A descrição tem 122 caracteres (limite recomendado: 150-160). | Expandir a meta description para incluir benefícios adicionais como "próximo à Orla do Rio São Francisco" para atingir ~155 caracteres. |
| **Redirects** | ⚠️ Aviso | Confirmado | Redirecionamento temporário 307 em vez de 301 Permanente. | `https://flatsintegracao.com.br/` retorna `307 Temporary Redirect` para a versão com `www`. | Configurar a regra de redirecionamento de domínio na hospedagem como redirecionamento permanente (301). |
| **Images** | ⚠️ Aviso | Confirmado | Imagens do blog/cards sem atributos de largura e altura. | Imagens como `vapor-do-vinho-montagem.webp` e `bododromo-petrolina.webp` têm width/height como `null`. | Definir os atributos `width` e `height` em todas as imagens estáticas dos cards para prevenir oscilação de layout (CLS). |
| **AI Search** | ⚠️ Aviso | Confirmado | O arquivo `llms.txt` está vazio/incompleto e robots.txt não gerencia agentes de IA. | O arquivo `llms.txt` tem score de qualidade de 5/100; 7 robôs de IA não estão explicitamente bloqueados/permitidos. | Atualizar o `llms.txt` com o título e sumário da empresa e declarar restrições/permissões explícitas no `robots.txt` para bots como `ChatGPT-User` e `Applebot-Extended`. |
| **Images** | ⚠️ Aviso | Confirmado | Logo principal embutido como string gigante Base64. | O src do logo é um data-uri muito extenso, inflando o tamanho inicial do HTML. | Substituir a string Base64 por uma referência direta a um arquivo SVG ou WebP otimizado (ex: `/assets/logo.svg`). |
| **Calculadora/Guia** | ℹ️ Info | Confirmado | Rotas internas órfãs fazem parte do escopo privado (Guia/Admin). | Rotas como `/calculadora`, `/guia/hospedagem-proximo-hospitais-petrolina` e área administrativa não têm links diretos públicos. | **Sem ação necessária:** Confirmado pelo usuário que estas páginas não pertencem à auditoria pública de SEO do site. |

---

## C) Detalhamento do Cálculo de Pontuação (Scoring Protocol)

Seguindo o protocolo de pontuação do rubric para as categorias elegíveis:

1. **SEO Técnico (Technical SEO) — Nota: 5/100**
   - *Sinais Positivos (+2):* Presença de HTTPS ativa; presença de robots.txt correto apontando para o sitemap.
   - *Déficits (-3):* Falta de tag canonical (Crítico); falta de cabeçalhos de segurança (Crítico); HSTS ausente de subdomínios (Aviso).
   - *Cálculo Base:* `2 / (2 + 3) * 100 = 40`
   - *Penalidades:* -15 (Falta de Canonical) -15 (Falta de Security Headers) -5 (HSTS parcial) = -35.
   - *Nota Final:* `40 - 35 = 5/100`

2. **SEO On-Page — Nota: 40/100**
   - *Sinais Positivos (+3):* Presença de exatamente uma H1; Title tag única e otimizada; Meta description única.
   - *Déficits (-3):* Typo de concatenação de espaço no H1 (Aviso); Typo de concatenação de espaço nos H2s (Aviso); Meta description abaixo da faixa recomendada de caracteres (Aviso).
   - *Cálculo Base:* `3 / (3 + 3) * 100 = 50`
   - *Penalidades:* -5 (Typo no H1) -5 (Meta curta) = -10.
   - *Nota Final:* `50 - 10 = 40/100`

3. **Dados Estruturados (Schema) — Nota: 0/100**
   - *Déficits (-1):* Falta completa de JSON-LD estruturado na homepage.
   - *Cálculo Base:* `0 / (0 + 1) * 100 = 0`
   - *Penalidades:* -15 (Sem JSON-LD).
   - *Nota Final:* `0/100` (Piso = 0).

4. **Otimização de Imagens — Nota: 40/100**
   - *Sinais Positivos (+3):* Uso consistente de formato moderno WebP; alt text presente na maioria das imagens; picture tag responsiva no banner de Hero.
   - *Déficits (-3):* Imagens de cards sem dimensões width/height (Aviso); logo em Base64 inflando o HTML (Aviso); logo do WhatsApp sem lazy-loading.
   - *Cálculo Base:* `3 / (3 + 3) * 100 = 50`
   - *Penalidades:* -5 (Imagens sem width/height) -5 (Logo em Base64) = -10.
   - *Nota Final:* `50 - 10 = 40/100`

5. **Prontidão de Busca por IA (GEO) — Nota: 23/100**
   - *Sinais Positivos (+1):* Presença física dos arquivos `llms.txt` e `llms-full.txt`.
   - *Déficits (-2):* `llms.txt` vazio/sem estrutura recomendada (Aviso); 7 rastreadores de IA sem regras específicas no `robots.txt` (Aviso).
   - *Cálculo Base:* `1 / (1 + 2) * 100 = 33`
   - *Penalidades:* -5 (llms.txt incompleto) -5 (Robots.txt incompleto para IA) = -10.
   - *Nota Final:* `33 - 10 = 23/100`

6. **Desempenho (Performance & Core Web Vitals) — Nota: Insuficiente de Dados (Média)**
   - *Observação:* A cota gratuita da API pública do PageSpeed retornou um erro de limite de requisições durante a execução automática, impedindo o cálculo preciso.

**Cálculo da Média Ponderada Geral (Normalizada):**
Ponderando as categorias calculadas de acordo com as diretrizes do Skill:
- Technical SEO (25% peso) -> `5 * 0.25 = 1.25`
- Content Quality (20% peso) -> `62 * 0.20 = 12.4` (Score extraído do analisador de artigos de suporte)
- On-Page SEO (15% peso) -> `40 * 0.15 = 6.0`
- Schema / Structured Data (15% peso) -> `0 * 0.15 = 0.0`
- Performance (10% peso) -> Tratado como neutro `50 * 0.10 = 5.0`
- Image Optimization (10% peso) -> `40 * 0.10 = 4.0`
- AI Search Readiness (5% peso) -> `23 * 0.05 = 1.15`

*Pontuação Ponderada Total:* `1.25 + 12.4 + 6.0 + 0 + 5.0 + 4.0 + 1.15 = 29.8 -> ~30/100` (Classificação: **Necessita de Melhorias**).

---

## D) Unknowns (Incógnitas) e Acompanhamento
- **Métricas Reais de Core Web Vitals:** É necessário rodar uma verificação com chave de API do PageSpeed ou testar localmente via Lighthouse no navegador para ter certeza se as imagens sem dimensões estão provocando Layout Shifts (CLS) significativos em dispositivos móveis.
- **Estruturação do Guia Privado:** Confirmar se o guia de hóspedes privado está protegido contra indexação (ex: com metatag `noindex`) para impedir que páginas incompletas ou de uso exclusivo de clientes apareçam nos resultados do Google.
