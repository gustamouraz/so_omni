# Instalação do SO Omni em uma central semelhante à Vi-150

## Conclusão antes de instalar

O [manual da plataforma Vi-150](https://centralmultimidiaoriginal.com.br/uploads/arquivos/MANUAL-Vi-150.pdf)
descreve uma central baseada em **Windows CE 6.0**. Ele permite selecionar, no
cartão SD, um executável de navegador compatível com Windows CE; isso não é um
mecanismo de inicialização ou atualização de um sistema Linux.

O manual também descreve o **PhoneLink** como espelhamento de um telefone Android
por USB, com áudio por Bluetooth. Não há indicação de Android Auto, CarPlay,
desbloqueio do bootloader, modo de recuperação ou gravação de firmware.

Por isso:

> **Não grave `output/qemu-aarch64/rootfs.ext4`, `Image` ou qualquer outro arquivo
> do alvo QEMU na central.** Esses artefatos foram construídos para uma máquina
> virtual ARM64 e não constituem firmware para a placa real.

O Windows Embedded CE 6.0 encerrou o suporte estendido em 10 de abril de 2018,
conforme o [ciclo de vida publicado pela Microsoft](https://learn.microsoft.com/pt-br/lifecycle/products/windows-embedded-ce-60).
Isso reforça a conveniência da migração, mas não identifica o processador nem
torna a placa automaticamente compatível com Linux.

## Rotas possíveis

### 1. Substituição integral do sistema — somente depois de identificar a placa

É viável apenas se existirem:

- suporte Linux para o SoC e para a memória da placa;
- bootloader conhecido e recuperável;
- kernel, device tree e drivers para tela, touch, áudio, USB, Wi-Fi, Bluetooth e GPS;
- documentação ou engenharia reversa do protocolo da MCU automotiva;
- firmware original e procedimento de recuperação testado.

Essa é a rota em que criaremos um alvo Buildroot específico para a placa. O
[manual do Buildroot](https://buildroot.org/downloads/manual/manual.html) prevê
uma configuração, kernel, bootloader, device tree e arquivos de placa próprios
para cada hardware. O alvo QEMU atual continuará apenas como ambiente de teste.

### 2. Computador externo mantendo a eletrônica automotiva original — rota mais segura

Se a placa Windows CE não tiver BSP ou recuperação confiável, o SO Omni pode
rodar em um módulo Linux separado. A central original, ou uma interface dedicada,
continua responsável por rádio, amplificador, CAN, comandos do volante, câmera de
ré e gerenciamento de energia. A compatibilidade elétrica da tela, do touch e do
áudio precisa ser verificada antes de escolher o módulo.

### 3. Aplicativo Windows CE no cartão SD — não substitui o sistema operacional

Seria possível desenvolver somente um launcher/aplicativo compatível com o
Windows CE da central. Essa opção não executa o Linux do SO Omni e não é uma base
adequada para as integrações modernas planejadas.

## Procedimento seguro de instalação

As etapas abaixo são intencionalmente divididas por pontos de decisão. Não avance
para uma etapa de gravação enquanto a anterior não estiver concluída.

### Etapa 0 — preservar a central e trabalhar em bancada

1. Desconecte o polo negativo da bateria antes de remover a central do veículo.
2. Fotografe a posição e o sentido de todos os conectores.
3. Registre todas as telas de configuração, inclusive rádio, Bluetooth, câmera,
   comandos do volante e configurações de fábrica.
4. Use na bancada uma fonte automotiva estabilizada, protegida por fusível e com
   limite de corrente. Não use um carregador genérico de 12 V.
5. Não altere `Tipo BT`, `Modelo Veículo`, `Can-Bus`, `USB8288 Type` ou
   `USBARM Type`. O próprio manual alerta que esses itens afetam funções importantes.

### Etapa 1 — identificar exatamente o hardware

Colete e coloque em `docs/evidencias-hardware/`:

- fotos nítidas da etiqueta externa, frente e traseira;
- fotos da tela **Informações do Sistema**, incluindo todas as páginas;
- fotos perpendiculares dos dois lados da placa, com os códigos dos chips legíveis;
- modelo do SoC, chips de RAM, NAND/eMMC, controlador de touch e módulo Wi-Fi/BT;
- resolução e interface do display;
- identificação dos conectores, tensão de alimentação e pinagem conhecida;
- resultado da enumeração USB no computador, sem instalar gravadores desconhecidos;
- arquivos de firmware originais e ferramenta oficial, se fornecidos pelo fabricante.

A descrição “semelhante à Vi-150” não é suficiente para escolher uma imagem. Duas
centrais com a mesma aparência podem usar SoCs, bootloaders e displays diferentes.

### Etapa 2 — obter recuperação e backup antes de escrever

1. Obtenha do fabricante/revendedor o firmware original da variante exata.
2. Identifique o modo oficial de atualização e o modo de recuperação.
3. Localize a UART da placa e confirme o nível elétrico com instrumento adequado;
   não conecte um adaptador serial antes de saber se é 1,8 V, 3,3 V ou outro nível.
4. Faça uma cópia integral da NAND/eMMC com a ferramenta específica do SoC.
5. Gere hashes SHA-256 do backup, guarde duas cópias e valide uma restauração em
   mídia de teste ou pelo método oficial.

Não existe um comando de backup universal: a ferramenta correta depende do SoC e
do tipo de armazenamento. A instrução concreta será adicionada depois da identificação.

### Etapa 3 — criar o alvo de placa do SO Omni

Depois de confirmar o hardware, será criado no projeto:

```text
embedded/buildroot-external/
├── board/omni/<placa>/
│   ├── linux.config
│   ├── device-tree.dts
│   ├── rootfs-overlay/
│   └── genimage.cfg
└── configs/omni_<placa>_defconfig
```

O alvo deve corresponder à arquitetura real, possivelmente ARM de 32 bits em uma
central dessa geração. Ele deverá preservar a comunicação com a MCU ou substituí-la
por uma implementação validada.

### Etapa 4 — primeiro boot sem alterar o armazenamento interno

1. Inicialize por SD/USB, pela RAM ou pelo modo de desenvolvimento suportado pelo
   bootloader; a opção exata depende da placa.
2. Mantenha o firmware original intacto.
3. Valide console serial, watchdog e desligamento seguro por perda de ACC.
4. Teste display, brilho, touch, áudio, microfone, USB, Wi-Fi, Bluetooth, GPS,
   câmera de ré, CAN e comandos do volante.
5. Faça ciclos de partida e corte abrupto de energia antes de considerar instalação.

### Etapa 5 — gravação interna e retorno

A gravação só será autorizada quando houver:

- boot repetível por mídia removível;
- backup e restauração do firmware original comprovados;
- mapa de partições conhecido;
- imagem específica da placa com hashes publicados;
- procedimento de recuperação que não dependa do sistema instalado;
- plano de retorno executado ao menos uma vez em bancada.

Se o bootloader e o armazenamento permitirem, a imagem final deverá adotar duas
partições de sistema (A/B), dados separados e seleção automática da versão anterior
após falhas consecutivas de inicialização.

## Critérios para considerar o equipamento incompatível

Recomenda-se a rota do computador externo ou a troca da central quando ocorrer
qualquer um destes casos:

- SoC sem kernel/BSP Linux utilizável;
- menos memória do que a informada para o projeto;
- armazenamento NAND sem ferramenta de backup e recuperação;
- display, touch ou codec sem documentação e sem driver;
- MCU proprietária indispensável, sem protocolo identificável;
- bootloader bloqueado ou ausência de acesso de recuperação;
- custo de engenharia maior que o de uma placa documentada e suportada.

## Próxima coleta necessária

Para transformar este guia em comandos exatos de instalação, precisamos primeiro
das fotos e informações listadas na Etapa 1. Até lá, nenhuma gravação deve ser
feita no aparelho.
