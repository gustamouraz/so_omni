# Arquitetura inicial

## Objetivos

- inicializar a tela inicial em até 8 segundos após o kernel;
- permanecer abaixo de 350 MB de RAM no modo normal, deixando margem para
  projeção e caches;
- funcionar sem internet para configurações, mídia local, câmera de ré e mapa
  alternativo/offline;
- impedir que uma falha de mapa, telefone ou rede derrube a interface principal;
- permitir atualização A/B recuperável em uma etapa posterior.

## Camadas

```text
Launcher nativo / HMI
    |-- mapa (provedor substituível)
    |-- mídia e chamadas
    |-- configurações
    `-- superfície de projeção
             |
Omni Core (estado e regras de segurança)
    |-- adaptador Wi-Fi       -> ConnMan + wpa_supplicant
    |-- adaptador Bluetooth   -> BlueZ + áudio
    |-- adaptador GPS         -> gpsd
    |-- Android Auto          -> middleware homologado
    `-- Apple CarPlay         -> middleware MFi homologado
             |
Linux + drivers da placa + BusyBox init
```

O `Omni Core` não conhece detalhes de fornecedores. Ele recebe eventos dos
adaptadores e publica um único estado coerente para a interface. A primeira
implementação dessa máquina de estados está em `embedded/apps/omni-core`.

## Componentes propostos

| Função | Escolha inicial | Motivo |
| --- | --- | --- |
| Build do SO | Buildroot | imagem pequena e reproduzível |
| Init | BusyBox init | baixo consumo e boot simples |
| IPC | D-Bus do sistema | integração natural com BlueZ e ConnMan |
| Wi-Fi | ConnMan + wpa_supplicant | gerenciamento de rede com API D-Bus |
| Bluetooth | BlueZ | pilha Bluetooth padrão do Linux |
| Áudio | ALSA; PipeWire somente se necessário | começar com menor footprint |
| GPS | gpsd | desacopla driver e consumidores |
| UI final | C/C++ sobre DRM/KMS ou LVGL | previsibilidade de RAM e boot |
| Protótipo | HTML/CSS/JS sem frameworks | validar fluxo antes do port |

## Orçamento de recursos

Os números abaixo são metas de projeto, não medições da placa ainda.

| Área | RAM alvo | Armazenamento alvo |
| --- | ---: | ---: |
| Kernel, init e serviços básicos | 100 MB | 150 MB |
| Launcher/HMI | 80 MB | 80 MB |
| Wi-Fi, Bluetooth, áudio e GPS | 90 MB | 120 MB |
| Mapa nativo em uso | 180 MB | 1-4 GB de dados |
| Middleware de projeção | 250 MB | 300 MB |
| Reserva do sistema | 300 MB | — |
| Sistema A/B, logs e dados | — | restante dos 16 GB |

Mapa nativo e projeção não devem ficar renderizando simultaneamente. Ao conectar
Android Auto ou CarPlay, o mapa local é suspenso e seus caches são liberados.

## Particionamento sugerido

Somente será fechado depois de conhecer o bootloader e o armazenamento real:

```text
boot       256 MB
rootfs A   1.5 GB (somente leitura)
rootfs B   1.5 GB (somente leitura)
data       restante (mapas, pareamentos, preferências e logs limitados)
```

Não guardar credenciais no rootfs. A partição `data` deve ser criptografada se o
SoC oferecer uma raiz de confiança útil e segura.

## Regras automotivas essenciais

- controles complexos ficam bloqueados com o veículo em movimento;
- câmera de ré e avisos críticos têm prioridade sobre qualquer projeção;
- watchdog reinicia apenas o serviço travado antes de reiniciar a unidade;
- o sistema nunca controla funções críticas do veículo nesta primeira fase;
- entradas CAN são somente leitura até existir análise formal de segurança.

