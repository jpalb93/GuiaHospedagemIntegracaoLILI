# Projeto: Automação de Lavanderia Pay-Per-Use
**Objetivo:** Permitir que hóspedes comprem ciclos de lavagem via App, com liberação automática de energia para a máquina.

---

## 1. Para a Dona do Flat (Visão de Negócio)

### O Conceito
Em vez de cobrar por "hora" (o que gera ansiedade e risco de cortar a máquina cheia), venderemos **"Ciclos de Lavagem"**.
*   O hóspede paga por 1 lavagem.
*   O sistema libera energia por **2 horas e 30 minutos**.
*   **Por que 2h30?** É tempo suficiente para qualquer ciclo de lavagem + centrifugação terminar com folga.
*   **A Segurança:** Após esse tempo, a energia é cortada. Isso impede que o hóspede "emende" uma segunda lavagem de graça, mas garante que a primeira lavagem termine sem travar a porta da máquina.

### Investimento Necessário (Hardware)
A solução é baseada em **Tomadas Inteligentes Wi-Fi**. Não requer obra, apenas plugar na tomada existente.

**Item Obrigatório:** Tomada Inteligente de **20 Amperes (20A)**.
*   *Nota:* Tomadas comuns (10A) vão derreter com o calor da máquina de lavar. Tem que ser a de 20A (pino mais grosso).

**Modelos Recomendados (Pesquisa Nov/2025):**
1.  **Tomada Inteligente Ekaza 20A** (Média: R$ 60,00 - R$ 80,00)
    *   *Vantagem:* App muito estável, fácil de achar no Mercado Livre/Amazon.
2.  **Tomada Inteligente Positivo Casa Inteligente 16A/20A** (Média: R$ 90,00)
    *   *Vantagem:* Marca brasileira, garantia local fácil.
3.  **Sonoff S26 (Versão 20A)** (Média: R$ 70,00)
    *   *Vantagem:* Marca favorita de automação, muito robusta.

**Custo Total Estimado:** R$ 100,00 (com frete).

### Como vai funcionar na prática?
1.  A máquina de lavar fica plugada nessa tomada inteligente.
2.  A tomada fica **sempre desligada** (sem energia).
3.  O hóspede entra no App do Flat > Serviços > Lavanderia.
4.  Paga R$ XX,00 no Pix.
5.  Assim que o Pix confirma, a tomada liga sozinha.
6.  O hóspede usa a máquina.
7.  Depois de 2h30, a tomada desliga sozinha.

---

## 2. Para a Equipe Técnica (Implementação)

### Arquitetura
Utilizaremos a **Tuya IoT Platform** como middleware. O Node.js não se comunica diretamente com o IP da tomada (que muda), mas sim com a API da Tuya na nuvem, que envia o comando push para o dispositivo.

### Passo 1: Configuração Tuya (Cloud)
1.  Criar conta em [iot.tuya.com](https://iot.tuya.com/).
2.  Criar projeto "Cloud Development".
3.  Vincular o App "Smart Life" (onde a tomada foi instalada) com a conta de dev via QR Code.
4.  Obter credenciais: `Access ID`, `Access Secret` e `Device ID`.

### Passo 2: Backend (Node.js)
Instalar biblioteca oficial ou usar requisições HTTP assinadas.
*   **Lib:** `tuyapi` ou integração direta REST.

**Endpoint de Ativação (`/api/services/laundry/start`):**
Este endpoint será chamado pelo Webhook do Mercado Pago ou manualmente pelo Admin.

```javascript
// Exemplo conceitual do Payload para a API Tuya
const commands = [
  {
    code: 'switch_1',
    value: true // Ligar
  },
  {
    code: 'countdown_1',
    value: 9000 // 9000 segundos = 2h 30min
  }
];

// A mágica do "countdown_1":
// O comando é enviado PARA O HARDWARE. A contagem regressiva acontece
// dentro do chip da tomada. Se a internet cair 1 minuto depois,
// a tomada AINDA VAI DESLIGAR quando o tempo acabar. É 100% seguro.
```

### Passo 3: Frontend (React)
1.  **Card de Serviço:** Novo card "Lavanderia" na área de serviços.
2.  **Status em Tempo Real:**
    *   Consultar status da tomada via API.
    *   Se `switch_1 === true`, mostrar: *"Máquina em uso. Tempo restante estimado: XX min"*.
3.  **Botão de Emergência (Admin):**
    *   No painel da dona, um botão "Ligar Forçado" e "Desligar Forçado" para casos de suporte.

### Passo 4: Monitoramento de Consumo (Fase 2 - Opcional)
As tomadas Tuya retornam a corrente elétrica (`cur_current`).
*   Podemos criar uma lógica: *Se o tempo acabou, mas `cur_current > 100mA` (máquina ainda girando), estenda o tempo em 15 minutos.*
*   Isso evita desligar no meio da centrifugação se o hóspede demorou para começar.

---

## Resumo para Aprovação
*   **Custo Hardware:** Baixo (~R$ 100).
*   **Risco:** Baixo (Sistema de contagem regressiva no hardware evita erros de rede).
*   **Complexidade:** Média (Exige integração com API externa Tuya, mas é bem documentada).
