# Progresso — substituição do sistema da central AC8227A

Atualizado em 26/07/2026.

## Objetivo

Substituir o Android original por um sistema SO Omni específico da placa, sem
perder a possibilidade de recuperação. Nenhum firmware foi gravado até aqui.

## Hardware confirmado

- SoC: AutoChips AC8227A / família AC8227L;
- CPU: ARM Cortex-A7, 4 núcleos, arquitetura `armv7l`;
- GPU: Mali-450 MP;
- RAM: 1 GB DDR3 (4 × Samsung K4B2G0846C-HCH9);
- armazenamento: eMMC Toshiba/Kioxia THGBMFG7C2LBAIL, 16 GB;
- Wi-Fi/Bluetooth: MediaTek MT6623LGA;
- áudio: ST TDA7729;
- tela: 1024 × 600, 60 Hz;
- MCU auxiliar: Chipsea F030C8T6.

Detalhes e fotos de referência: [placa-ac8227a.md](placa-ac8227a.md).

## Software original identificado

- modelo: `D02022HA16`;
- produto: `8227L_demo`;
- Android efetivo: 10 / API 29 (a tela comercial informa Android 11);
- build/fingerprint: `alps/full_8227l_demo/8227l_demo:10/Q/011019/16586120:user/test-keys`;
- kernel: Linux 4.14.116, compilado em 30/08/2022;
- acesso root: informado como habilitado pelo AIDA64;
- partições eMMC visíveis em
  `/dev/block/platform/soc/11230000.mmc/by-name/`;
- UART de diagnóstico exposta na placa: `PRINT_RX`, `PRINT_TX`, `GND`.

## O que já foi feito no projeto

- Protótipo otimizado para 1 GB de RAM: menos renderizações em estado ocioso,
  animações reduzidas por padrão e controles adequados à tela 1024 × 600.
- Núcleo `omni-core` configurado para build `Release` com prioridade a tamanho.
- Testes do protótipo executados com sucesso: 13/13.
- Criado o coletor ADB de somente leitura:
  [collect-ac8227a-evidence.ps1](../tools/collect-ac8227a-evidence.ps1).

## Próximo passo — ADB somente leitura

1. Instalar Android Platform Tools no computador.
2. Na central, habilitar apenas **Depuração USB** em Opções do desenvolvedor.
3. Conectar uma porta USB de dados da central ao computador.
4. Executar, no PowerShell:

   ```powershell
   cd C:\Projetos\so_omni
   .\tools\collect-ac8227a-evidence.ps1
   ```

5. Guardar e enviar o conteúdo de `output\ac8227a-evidence`.

O script coleta `getprop`, kernel, linha de boot, tabela de partições,
links `by-name`, pontos montados e identidade root. Ele não escreve na central.

## Depois da coleta

1. Analisar o particionamento e identificar bootloader e recuperação.
2. Obter firmware oficial ou criar backup integral da eMMC por método validado.
3. Gerar hashes SHA-256 e validar a restauração do backup.
4. Montar alvo Linux/Buildroot ARMv7 com kernel, device tree e firmwares da
   placa — a imagem ARM64/QEMU existente não serve para esta central.
5. Testar boot sem gravar eMMC: tela, touch, áudio, câmera, Wi-Fi, Bluetooth,
   GPS e comandos físicos.
6. Só após recuperação comprovada, planejar a gravação interna.

## Regras de segurança

- Não gravar `output/qemu-aarch64`, firmware genérico 8227L nem arquivos de
  outro modelo.
- Não usar `dd`, ferramenta de flash ou recuperação sem backup validado.
- Não conectar à UART sem medir antes a tensão de `PRINT_TX` com multímetro.
- Não regravar a MCU Chipsea, que pode controlar funções do veículo.
