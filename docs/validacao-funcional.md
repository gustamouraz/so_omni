# Validação funcional antes da instalação

Este documento é um bloqueio de liberação: o SO Omni não deve ser gravado em uma
central física enquanto todos os critérios aplicáveis não estiverem aprovados.

## Estado atual do protótipo

Em 22 de julho de 2026, a máquina de estados do protótipo possui testes
automatizados para:

- seleção das cinco abas;
- Wi-Fi e Bluetooth, incluindo desconexão segura das funções dependentes;
- seleção exclusiva de Android Auto ou CarPlay no modo demonstrativo;
- reprodução, pausa, fila, faixa anterior/próxima, busca, volume, mudo,
  aleatório, repetição e avanço pelo tempo;
- conexão e desconexão do telefone demonstrativo;
- contatos, teclado, correção do número, início, duração e término de chamada;
- brilho, redução de animações e restauração das preferências;
- rejeição de estados inválidos, como projetar ou ligar sem Bluetooth/telefone.

Execute:

```powershell
cd prototype
npm test
npm start
```

Os testes automatizados validam a lógica. A revisão visual e por toque deve ser
repetida em 1024 × 600 e na resolução real do display antes de cada versão.

## Checklist manual da interface

### Mapa

- [ ] A aba abre pelo dock e pelo logotipo.
- [ ] `Iniciar navegação` conecta a projeção demonstrativa quando o Bluetooth está ativo.
- [ ] Com Bluetooth desativado, o botão apresenta uma orientação e não cria estado inválido.
- [ ] Android Auto e CarPlay são mutuamente exclusivos e podem ser desconectados.

### Mídia

- [ ] Reproduzir/pausar funciona na tela inicial e na tela de mídia.
- [ ] Anterior, próxima e seleção pela fila atualizam título e artista.
- [ ] A barra de progresso permite buscar dentro da duração da faixa.
- [ ] Volume, mudo, aleatório e repetição exibem o estado correto.
- [ ] A faixa avança automaticamente ao terminar.

### Telefone

- [ ] A tela orienta a ativar o Bluetooth quando necessário.
- [ ] Conectar e desconectar o telefone atualiza todas as telas.
- [ ] Uma chamada pode ser iniciada por contato e pelo teclado.
- [ ] Apagar dígito, duração da chamada e encerrar chamada funcionam.
- [ ] Desativar o Bluetooth encerra chamada e projeção com segurança.

### Apps e Ajustes

- [ ] Cada aplicativo abre a tela correspondente.
- [ ] Os botões de Wi-Fi e Bluetooth refletem o mesmo estado no topo e em Ajustes.
- [ ] Brilho e volume respondem em toda a interface.
- [ ] Reduzir animações e restaurar ajustes funcionam.
- [ ] Nenhum conteúdo fica cortado ou inacessível pelo toque.

## Validação obrigatória no hardware real

O protótipo simula os serviços. Aprovar sua interface não comprova funcionamento
dos periféricos da central. O firmware físico só poderá ser chamado de operacional
quando também forem aprovados:

- Wi-Fi: busca, associação, senha, reconexão, endereço IP e perda de sinal;
- Bluetooth: pareamento, contatos, chamadas HFP, áudio A2DP/AVRCP e microfone;
- mídia: USB real, formatos suportados, remoção durante reprodução e retomada;
- Android Auto e CarPlay: receptor autorizado, USB, áudio, vídeo e comandos;
- tela e touch: calibração, múltiplos toques, brilho e operação a frio/quente;
- áudio automotivo: amplificador, volume, mute, chamada, navegação e marcha à ré;
- GPS, câmera de ré, CAN, comandos do volante, ACC, suspensão e watchdog;
- cinquenta ciclos de ligar/desligar e testes de corte inesperado de energia;
- restauração do firmware anterior pelo procedimento de recuperação.

## Regra de liberação

A imagem de produção exige três aprovações separadas:

1. testes automatizados sem falhas;
2. checklist visual/touch integralmente marcado;
3. integração física validada em bancada na placa exata.

Uma aprovação não substitui as outras duas.
