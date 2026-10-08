# Imagem de desenvolvimento ARM64

O alvo QEMU permite validar o SO Omni antes de receber a placa real. Ele usa
Buildroot 2026.05.1 e Linux 6.18.7, seguindo o defconfig ARM64 oficial do
Buildroot, acrescido dos serviços do projeto.

## Construir e testar

No PowerShell, com Docker Desktop em execução:

```powershell
.\tools\build-qemu.ps1
```

O processo compila e testa `omni-core`, gera kernel e rootfs, inicializa a imagem
em QEMU por até 45 segundos e confirma que o serviço chegou ao sistema em
execução. Downloads e intermediários ficam em volumes Docker reutilizáveis.

Artefatos finais são copiados para `output/qemu-aarch64`:

- `Image`: kernel ARM64;
- `rootfs.ext4`: sistema de arquivos;
- `buildroot.config`: configuração resolvida;
- `qemu-boot.log`: evidência do boot automatizado;
- `sizes.txt`: tamanhos do kernel e rootfs.
- `SHA256SUMS`: hashes do kernel e rootfs para conferir integridade.

Para abrir um console interativo após construir:

```powershell
.\tools\run-qemu.ps1
```

Use `root` para entrar. Encerre o QEMU com `Ctrl+A`, depois `X`.

Para reconstruir todo o volume de saída do zero:

```powershell
.\tools\build-qemu.ps1 -Clean
```

Esse alvo não simula rádio Wi-Fi, Bluetooth, áudio automotivo ou tela touch. Ele
valida arquitetura, pacotes, inicialização e o serviço central; os drivers reais
continuam dependendo do BSP da central.

## Resultado validado em 22/07/2026

- kernel Linux ARM64 gerado: aproximadamente 13 MB;
- conteúdo efetivo do rootfs: aproximadamente 24 MB;
- imagem ext4 reservada: 256 MB;
- `bluetoothd`, `connmand` e `omni-core` chegaram ao estado `OK`;
- login serial do SO Omni apareceu no QEMU;
- o binário `omni-core` foi confirmado como ELF AArch64;
- o ícone oficial foi instalado em `/usr/share/omni/omni-icon.png`.
