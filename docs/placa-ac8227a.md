# Perfil da placa — AutoChips AC8227A

Evidências fotográficas coletadas em 26/07/2026. Este documento é uma base de
identificação; não autoriza a gravação de firmware.

## Componentes confirmados

| Função | Componente identificado | Consequência para o port |
| --- | --- | --- |
| SoC | AutoChips **AC8227A** | plataforma da família AC8227, ARMv7; não usar imagem ARM64/QEMU |
| RAM | 4 × Samsung **K4B2G0846C-HCH9** | DDR3 de 2 Gbit por chip, total de 1 GB |
| Armazenamento | Toshiba/Kioxia **THGBMFG7C2LBAIL** | eMMC de 16 GB; contém bootloader, Android e dados originais |
| Wi-Fi/Bluetooth | MediaTek **MT6623LGA** | driver e firmware específicos são necessários |
| Áudio | ST **TDA7729** | codec/processador de áudio automotivo existente |
| MCU auxiliar | Chipsea **F030C8T6** | provável controle de periféricos/veículo; não substituir nem regravar |

## Software original identificado

| Item | Valor observado |
| --- | --- |
| Modelo | `D02022HA16` |
| Produto Android | `8227L_demo` |
| Plataforma | `ac8227l` |
| Arquitetura | `armv7l`, ARM Cortex-A7 com 4 núcleos |
| GPU | ARM Mali-450 MP |
| Tela | 1024 × 600 a 60 Hz |
| Android real | 10 / API 29 (o menu "About Car" anuncia 11, mas o fingerprint e a API confirmam 10) |
| Kernel | Linux 4.14.116, compilado em 30/08/2022 |
| Build | `android-trunk-p0`; fingerprint `alps/full_8227l_demo/8227l_demo:10/Q/011019/16586120:user/test-keys` |
| Privilégio | `root` habilitado, reportado pelo AIDA64 |

O kernel expõe o caminho de partições
`/dev/block/platform/soc/11230000.mmc/by-name/`. Há também endpoint ADB no
sistema (`/dev/usb-ffs/adb`), portanto o próximo teste é conectar a central a
um computador e confirmar se a porta USB aceita depuração ADB.

O AC8227L é listado pelo fabricante como SoC de IVI pós-venda, com interfaces
para mídia, BT/Wi-Fi/GPS e coprocessador para funções como câmera de ré. A
marcação observada na placa é AC8227A; tratamos o suporte como específico desta
variante até obter o BSP do fabricante.

## Interfaces úteis observadas

- pads `PRINT_RX`, `PRINT_TX` e `GND`: provável console UART de diagnóstico;
- pads `SRCLK`, `SCK`, `WATCHDOG` e vários pontos de teste: não conectar nem
  usar para programação sem esquema elétrico;
- eMMC é BGA: não remover, não usar pinça SOIC e não gravar diretamente sem
  backup validado e procedimento da plataforma.

## Próxima etapa obrigatória: diagnóstico, depois backup

1. Com a placa desligada, medir a tensão de `PRINT_TX` em relação a `GND` ao
   iniciar. Usar adaptador USB–TTL compatível com a tensão medida (nunca RS-232).
2. Conectar apenas GND comum e RX do adaptador ao `PRINT_TX` da placa; capturar
   o log de boot, sem enviar dados à placa.
3. Identificar no log o bootloader, partições da eMMC, kernel e modo oficial de
   recuperação/atualização.
4. Obter firmware oficial da variante exata ou uma cópia integral da eMMC pelo
   método identificado. Calcular SHA-256 e testar restauração antes de gravar.
5. Somente então criar um alvo Buildroot ARMv7 específico, usando o kernel,
   device tree e firmwares que forem compatíveis com a placa.

Não há imagem de instalação gerada nesta fase. A perda do bootloader ou do
firmware da MCU pode impedir o funcionamento de tela, áudio, CAN, câmera e
comandos físicos.
