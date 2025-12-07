# Guia do Aplicativo de Gestão (Android)
> **Foco:** Este aplicativo é exclusivo para **Administradores e Anfitriões**.

## Por que um App só para Admins?
Para os hóspedes, a experiência via **Link (Web)** é superior pois não exige download/instalação.
Já para quem gerencia (você!), ter um aplicativo instalado traz superpoderes:
- **Acesso Rápido:** Ícone na tela inicial, clique e abra.
- **Login Persistente:** Não precisa ficar logando toda hora.
- **Notificações (Futuro):** Receber alertas de novas reservas ou mensagens direto na barra de status.
- **Foco Total:** Tela cheia, sem barra de navegador.

## Como Funciona
O código foi adaptado. O sistema inteligência:
1.  **Site (`flatsintegracao.com.br`):** Abre a tela de Login/Boas-vindas para Hóspedes.
2.  **App Android:** Abre direto o **Painel Administrativo**.

## Passo a Passo (Instalação e Atualização)

### 1. Pré-Requisitos
Ter o **Android Studio** instalado (Tutorial no Google Search se precisar).

### 2. Abrir o Projeto
1. Abra o Android Studio.
2. Clique em **Open**.
3. Selecione a pasta `android` dentro do projeto do Flat.

### 3. Gerar e Atualizar o App
Sempre que você fizer melhorias no site e quiser levar para o App:

1.  Abra o terminal no VS Code.
2.  Rode o comando mágico:
    ```bash
    npm run build && npx cap sync
    ```
3.  Volte para o Android Studio e clique no **Play (▶️)** para rodar no emulador ou no seu celular conectado.

### 4. Gerar APK Final (Para instalar no seu cel sem cabo)
1. No Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
2. Ele vai gerar um arquivo `.apk`.
3. Mande esse arquivo para o seu WhatsApp e instale. Pronto!

## Solução de Problemas Comuns

### Tela em Branco ou Carregando Infinito?
Se o App ficar travado no loading:
1.  Verifique se o site oficial (`flatsintegracao.com.br`) está no ar.
2.  O App depende da internet. Verifique sua conexão.
3.  **Limpar Dados:** Às vezes o cache segura uma versão antiga. Desinstale o app e instale de novo pelo Android Studio.

## FAQ - Quando Preciso Atualizar?
| Mudança | Precisa Atualizar o App? |
| :--- | :--- |
| **Criar/Editar Reservas** | ❌ Não (É automático) |
| **Mudar Textos/Dicas** | ❌ Não (Se for via CMS) |
| **Mudar Cor/Botão do Site** | ✅ **Sim** (Build + Sync) |
| **Nova Funcionalidade** | ✅ **Sim** (Build + Sync) |
