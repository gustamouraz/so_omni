# Perfil de otimização — central Android 11 (1 GB)

Este perfil corresponde às evidências coletadas em 26/07/2026. A unidade é uma
central Android genérica com CPU **ARMv7 Cortex-A7 quad-core a 1,5 GHz**, **1 GB
de RAM**, **16 GB de flash** e tela **1024 × 600**. A unidade informa Android
11, MCU 4.4 (X2) e decodificador ST/TDA7729.

## Limites adotados pelo SO Omni

- interface projetada em 1024 × 600, sem dependência de navegador pesado na
  imagem final;
- tela inicial, ajustes, mídia local, Bluetooth e câmera de ré têm prioridade;
- mapa local e projeção de telefone são mutuamente exclusivos;
- RAM operacional da interface e serviços básicos: até 350 MB; manter pelo
  menos 300 MB livres para áudio, drivers e picos temporários;
- dados de aplicativos e logs possuem limites de tamanho; caches de mapa são
  descartáveis;
- animações são reduzidas por padrão; o relógio, mídia e chamada não causam
  redesenho enquanto a respectiva tela não estiver visível, e o modo ocioso não
  acorda a interface a cada segundo;
- binários do núcleo são compilados em `Release` com otimização para tamanho.

## Conectores identificados

- USB 1: GND, 5 V, D+, D−;
- USB 2: 5 V, GND, D+, D−, Y_TXD, Y_RXD;
- conector A (20 pinos): áudio, vídeo CVBS, microfone, saída de vídeo e +12 V
  de amplificador;
- conector C (8 pinos): CAN_TX, CAN_RX, KEY_RST, +14,4 V, GND e iPod;
- conector F (10 pinos): câmera de ré (`BACK_CVBS`), sinal de freio,
  alimentação CAN e antena Wi-Fi;
- GPS por conector coaxial.

## O que ainda não pode ser feito com segurança

As telas não revelam o modelo do SoC, o bootloader, a NAND/eMMC, o controlador
da tela/touch nem os chips Wi-Fi/Bluetooth. Portanto, o alvo Buildroot ARM64 de
QEMU **não deve ser instalado** nesta central, que aparenta ser ARMv7. Antes de
produzir firmware, seguir as etapas de backup e identificação em
`docs/instalacao-dispositivo-vi150.md`.
