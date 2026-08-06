# Plano de Ação de SEO — Flats Integração

Abaixo está o plano de ação priorizado para corrigir os problemas identificados no site público `https://flatsintegracao.com.br/`.

---

## 1. Bloqueadores Imediatos (Immediate Blockers)

Essas correções são críticas para a indexação correta e segurança do site no Google.

### A) Inserir Tag Canônica (Canonical Tag)
- **Problema:** Ausência de tag canônica na homepage.
- **Solução:** Adicione a tag canônica apontando para a URL canônica preferida (com `www`).
- **Onde alterar:** No template principal da aplicação (ex: `index.html` ou componente de layout principal).
- **Código:**
  ```html
  <link rel="canonical" href="https://www.flatsintegracao.com.br/" />
  ```

### B) Adicionar Cabeçalhos de Segurança HTTP
- **Problema:** Postura de segurança fraca devido a 5 cabeçalhos ausentes.
- **Solução:** Configurar os cabeçalhos de resposta no arquivo de configuração do seu deployer (Vercel ou Firebase).
- **Onde alterar:** No arquivo `vercel.json` ou `firebase.json` na raiz do projeto.
- **Código (Exemplo para Vercel):**
  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "Content-Security-Policy", "value": "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" },
          { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ]
  }
  ```

---

## 2. Vitórias Rápidas (Quick Wins)

Melhorias de alto impacto na legibilidade e indexação de palavras-chave, realizáveis em poucos minutos.

### A) Corrigir Spacing typos nos Cabeçalhos JSX
- **Problema:** Compilação JSX junta palavras ao redor de quebras de linha (`<br />`).
- **Solução:** Adicionar um espaço explícito ou agrupar os textos de forma contígua nos componentes.

1. **[Hero.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/Hero.tsx#L104):**
   *De:*
   ```tsx
   Hospedagem em Petrolina <br />
   <span className="...">por Temporada</span>
   ```
   *Para:*
   ```tsx
   Hospedagem em Petrolina{" "}<br />
   <span className="...">por Temporada</span>
   ```

2. **[ReputationSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/ReputationSection.tsx#L121):**
   *De:*
   ```tsx
   Aprovado por <br />
   <span className="...">quem viveu.</span>
   ```
   *Para:*
   ```tsx
   Aprovado por{" "}<br />
   <span className="...">quem viveu.</span>
   ```

3. **[LocationSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/LocationSection.tsx#L93):**
   *De:*
   ```tsx
   Petrolina <br />
   <span className="...">Centro</span>
   ```
   *Para:*
   ```tsx
   Petrolina{" "}<br />
   <span className="...">Centro</span>
   ```

4. **[FeaturesSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/FeaturesSection.tsx#L73):**
   *De:*
   ```tsx
   O Melhor Flat em Petrolina <br />
   <span className="...">para Sua Estadia</span>
   ```
   *Para:*
   ```tsx
   O Melhor Flat em Petrolina{" "}<br />
   <span className="...">para Sua Estadia</span>
   ```

5. **[InfoSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/InfoSection.tsx#L97):**
   *De:*
   ```tsx
   Sua Hospedagem em Petrolina: <br />
   ```
   *Para:*
   ```tsx
   Sua Hospedagem em Petrolina:{" "}<br />
   ```

### B) Ajustar Redirecionamento de Domínio (307 para 301)
- **Problema:** Redirecionamento temporário (307) prejudica a transferência de autoridade de links externos para o site canônico.
- **Solução:** Configurar a hospedagem para fazer um redirecionamento `301 Moved Permanently` ao direcionar de `flatsintegracao.com.br` para `www.flatsintegracao.com.br`.

### C) Expandir a Meta Description
- **Problema:** Meta descrição de 122 caracteres é muito curta.
- **Solução:** Atualizar o cabeçalho do site para aumentar o engajamento na busca (CTR).
- **Novo texto sugerido:**
  > *"Hospedagem por temporada em Petrolina (Centro) com o melhor custo-benefício. Flats mobiliados e completos, ideais para lazer, negócios ou consultas médicas. Reserve já!"* (160 caracteres).

---

## 3. Melhorias Estratégicas (Strategic Improvements)

Melhorias estruturais de médio prazo para consolidar a autoridade do site e a prontidão para buscas baseadas em IA (GEO).

### A) Criar Dados Estruturados Schema JSON-LD
- **Problema:** Motores de busca não sabem o que a entidade "Flats Integração" representa em termos de dados e avaliações.
- **Solução:** Implementar uma tag de dados estruturados na homepage.
- **Código Sugerido (Colar no `<head>` do `index.html`):**
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Flats Integração",
    "image": "https://www.flatsintegracao.com.br/assets/gallery/gallery-1.webp",
    "@id": "https://www.flatsintegracao.com.br/#business",
    "url": "https://www.flatsintegracao.com.br/",
    "telephone": "+5787988283273",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "R. São José, 475 B - Centro",
      "addressLocality": "Petrolina",
      "addressRegion": "PE",
      "postalCode": "56302-270",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -9.395689,
      "longitude": -40.505701
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "9.0",
      "reviewCount": "150",
      "bestRating": "10",
      "worstRating": "1"
    },
    "sameAs": [
      "https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html",
      "https://www.instagram.com/flatsintegracao/"
    ]
  }
  </script>
  ```

### B) Definir Atributos Width/Height nas Imagens dos Cards
- **Problema:** Imagens sem dimensões de largura e altura explícitas causam oscilação de layout (CLS).
- **Solução:** Em [BlogSection.tsx](file:///c:/projetos-eximus/Flats-Integracao/src/components/LandingFlats/BlogSection.tsx), adicione explicitamente `width` e `height` equivalentes à proporção original da imagem (ex: `width={600} height={400}`).

### C) Configurar Gerenciamento de Crawlers de IA
- **Problema:** O robots.txt e o llms.txt não dão suporte a mecanismos de busca de inteligência artificial (ChatGPT, Claude, Applebot).
- **Solução:** 
  1. No `robots.txt`, declare a permissão ou bloqueio específico para os agentes de busca de IA (ex: ChatGPT-User, Applebot-Extended).
  2. Preencha o arquivo `llms.txt` na raiz com o título principal (`# Flats Integração`) e uma descrição clara em markdown.
