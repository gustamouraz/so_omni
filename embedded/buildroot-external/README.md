# Camada externa Buildroot do SO Omni

Esta árvore contém os componentes independentes da placa. Kernel, bootloader e
device tree devem vir do BSP do fabricante do equipamento.

Em Linux, após obter o Buildroot e o defconfig da placa:

    make BR2_EXTERNAL=$PWD/embedded/buildroot-external <defconfig-da-placa>
    ./support/kconfig/merge_config.sh -m .config embedded/buildroot-external/configs/omni_base.fragment
    make olddefconfig
    make

O fragmento adiciona BusyBox init, D-Bus, ConnMan, wpa_supplicant, BlueZ, ALSA,
gpsd e omni-core. Revise conflitos entre o gerenciador de rede do BSP e ConnMan.

Interface provisória para a prova de integração:

    echo 'projection android_auto' > /run/omni/commands
    cat /run/omni/state.json

A versão seguinte usará D-Bus e adaptadores reais para BlueZ/ConnMan e para os
middlewares licenciados.
