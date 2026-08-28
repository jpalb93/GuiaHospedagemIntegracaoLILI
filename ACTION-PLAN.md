# 📋 Plano de Ação SEO — Flats Integração (2026)

- **URL:** `https://www.flatsintegracao.com.br/`
- **Nota Geral:** **~90 / 100** (Excelente)
- **Status dos Problemas Críticos Anteriores:** **100% Corrigidos**

---

## 🎯 Otimizações Finais Recomendadas (Backlog de Polimento)

### 1. Injetar Dimensões Explícitas nos Cards de Artigo do Blog

- **Prioridade:** ⚠️ Média (Prevenção de Layout Shift / CLS)
- **Arquivo:** [`src/components/LandingFlats/BlogSection.tsx`](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/BlogSection.tsx)
- **Ação:** Adicionar atributos `width={600}` e `height={380}` nos elementos `<img>` dos artigos em `ARTICLES.map(...)`.

### 2. Otimizar Metadados Sociais Open Graph

- **Prioridade:** ℹ️ Baixa (Social Preview)
- **Arquivo:** [`index.html`](file:///c:/projetos-eximus/Flats-Integracao/index.html)
- **Ação:** Adicionar propriedades recomendadas de imagem:
    ```html
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Flats Integração" />
    ```

### 3. Monitoramento no Google Search Console

- **Prioridade:** ℹ️ Informativa / Operacional
- **Ação:** Acompanhar no GSC a indexação das páginas do guia (`/guia/*`) e confirmar a leitura do sitemap `https://www.flatsintegracao.com.br/sitemap.xml`.
