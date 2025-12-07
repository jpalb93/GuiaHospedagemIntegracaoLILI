# Walkthrough - Android App Integration
## O que foi feito
Transformamos o projeto React em um aplicativo **Híbrido**, capaz de rodar tanto na Web quanto no Android nativamente.

### 1. Arquitetura Híbrida (Segurança do Site)
O código agora possui inteligência para detectar o ambiente:
```typescript
const isNative = Capacitor.isNativePlatform();
// Se for site -> Comportamento padrão (100% igual ao original)
// Se for app -> Comportamentos nativos (Login automático, etc)
```
Isso garante **zero risco** de quebras no site web atual.

### 2. Integração com Capacitor
- Inicializado projeto Android na pasta `android/`.
- Configurado `App ID` único: `com.flatdelili.guest`.
- Adicionado plugin `@capacitor/app` para gerenciar o botão "Voltar" físico.

### 3. Melhorias de UX no App
- **Login Inteligente:** O app detecta que não é um navegador e pula a tela de "Copie o link do WhatsApp", indo direto para a tela de inserção de código.
- **Leitor de Links:** O campo de login agora aceita links inteiros (ex: `https://flat-lili.vercel.app/ABD123`) e extrai o código automaticamente.
- **Solução de CORS:** Implementado `CapacitorHttp` para permitir que o app acesse a API da Vercel sem bloqueios de segurança do navegador móvel.

### 4. Documentação
- Criado [ANDROID_GUIDE.md](file:///d:/copy-of-react-project-workspace01/ANDROID_GUIDE.md) com o passo a passo para:
    - Instalar Android Studio.
    - Rodar no Emulador/Celular.
    - Gerar o APK final.

## Resultados
| Recurso | Web (Site) | Android (App) |
| :--- | :--- | :--- |
| **Acesso** | Via Link | Ícone na Tela |
| **Navegação** | Browser | Fullscreen |
| **Login** | Automático via URL | Manual ou Colar Link |
| **API** | Fetch (Padrão) | CapacitorHttp (Nativo) |
