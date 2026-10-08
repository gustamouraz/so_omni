# SO Omni

Base inicial de uma central multimídia automotiva leve, pensada para equipamentos
com **1 GB de RAM** e **16 GB de armazenamento**.

Este repositório começa em duas frentes:

- `prototype/`: protótipo navegável da interface, executável em um computador;
- `embedded/`: esqueleto do sistema Linux embarcado e núcleo portátil em C;
- `docs/`: arquitetura, requisitos da placa, integrações e plano de entrega.

## Gerar a primeira imagem ARM64

Com Docker Desktop em execução:

```powershell
.\tools\build-qemu.ps1
```

O alvo compila, inicializa e testa a imagem automaticamente em QEMU. Consulte
[docs/qemu.md](docs/qemu.md) para detalhes e uso do console interativo.

> A imagem ARM64 do QEMU não é firmware para uma central física. Para centrais
> antigas semelhantes à Vi-150/Windows CE, siga primeiro o procedimento de
> identificação, backup e recuperação em
> [docs/instalacao-dispositivo-vi150.md](docs/instalacao-dispositivo-vi150.md).

## Executar o protótipo

Requer Node.js 20 ou superior e não baixa dependências.

```powershell
cd prototype
npm test
npm start
```

Abra `http://127.0.0.1:4173`. O protótipo foi desenhado em 1024 x 600, mas se
adapta a outras telas. Os controles de Wi-Fi, Bluetooth e projeção simulam a
máquina de estados que depois será ligada aos serviços reais.

Antes de instalar em uma central, conclua os três portões descritos em
[docs/validacao-funcional.md](docs/validacao-funcional.md): testes automatizados,
revisão visual/touch e integração com o hardware real.

## Construir o núcleo portátil

Em Linux, com CMake e um compilador C11:

```sh
cmake -S embedded/apps/omni-core -B build/omni-core
cmake --build build/omni-core
ctest --test-dir build/omni-core --output-on-failure
```

## Direção técnica

O alvo de produção é um Linux mínimo gerado pelo Buildroot, inicialização com
BusyBox, launcher nativo e serviços isolados. A imagem de produção não deve usar
um navegador completo para toda a interface. Isso preserva RAM para áudio,
Bluetooth e para o middleware de projeção do telefone.

Android Auto e CarPlay não são apenas bibliotecas comuns: a distribuição de um
receptor comercial depende dos programas e acordos dos respectivos fabricantes.
O Google Maps embarcado também exige validação comercial específica. Veja
[docs/integracoes.md](docs/integracoes.md) antes de escolher componentes.

As especificações observadas da central Android de destino e as decisões de
otimização estão em [perfil do dispositivo](docs/perfil-dispositivo-android-1gb.md).
Ela é ARMv7 com 1 GB de RAM; por isso, a imagem ARM64 de QEMU continua sendo
apenas ambiente de teste e não pode ser gravada na central.

## Próxima informação necessária

Para gerar uma imagem que inicialize no equipamento, precisamos do modelo exato
da placa/SoC, resolução e controlador da tela, touch, chipsets Wi-Fi/Bluetooth,
saídas de áudio, GPS e acesso ao esquema elétrico ou device tree atual. A lista
completa está em [docs/hardware.md](docs/hardware.md).
