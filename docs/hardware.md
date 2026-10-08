# Informações necessárias da placa

Preencher este documento antes de criar a primeira imagem de boot.

## Evidências já coletadas (26/07/2026)

- Android 11; CPU reportada como A7 1,5 GHz x4; DDR 1 GB; flash 16 GB;
- tela reportada como 1024 x 600; MCU 4.4 (X2); decoder ST/TDA7729;
- há USB, GPS, entradas CVBS/câmera de ré, CAN e Wi-Fi/BT aparentes;
- arquitetura e SoC ainda não foram confirmados. Tratar como ARMv7 provável,
  nunca como ARM64, até leitura da placa ou console serial.

Atualização: as fotos da placa confirmaram AutoChips AC8227A, 1 GB de DDR3,
eMMC Toshiba de 16 GB e módulo MediaTek MT6623LGA. Consulte
[perfil da placa AC8227A](placa-ac8227a.md) para a sequência segura de
diagnóstico e backup.

## Computação

- fabricante e modelo da central:
- SoC e arquitetura (ARMv7, ARM64, x86_64):
- quantidade e tipo de RAM:
- eMMC/NAND e tamanho real:
- bootloader atual e acesso ao console serial:
- kernel/BSP fornecido pelo fabricante:
- device tree e esquema elétrico disponíveis:

## Tela e entrada

- resolução e orientação:
- interface (RGB, LVDS, MIPI-DSI, HDMI):
- controlador do touch e barramento:
- quantidade de toques simultâneos:
- brilho controlável por software:
- botões/encoder físicos e códigos de entrada:

## Rádio e telefone

- chipset/módulo Wi-Fi:
- chipset/módulo Bluetooth e versão:
- antenas e coexistência Wi-Fi/Bluetooth:
- USB host e capacidade de carga por porta:
- suporte desejado: com fio, sem fio ou ambos:

## Áudio, navegação e veículo

- codec de áudio e amplificador:
- microfone, eco acústico e cancelamento de ruído:
- GPS/GNSS e porta usada:
- câmera de ré e formato de vídeo:
- interface CAN e transceptor:
- sinal de ignição/ACC e comportamento de suspensão:
- faixa de temperatura e requisitos de homologação:

## Critérios mínimos sugeridos

- aceleração gráfica com driver Linux funcional;
- ao menos duas portas USB 2.0 host;
- Wi-Fi 5 GHz para projeção sem fio;
- Bluetooth 4.2 ou superior com perfis necessários;
- hardware watchdog;
- armazenamento eMMC, evitando cartão SD em produto final;
- documentação do BSP e atualização segura do bootloader.
