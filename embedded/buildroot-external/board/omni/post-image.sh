#!/bin/sh
set -eu

cat > "$BINARIES_DIR/start-qemu.sh" <<EOF
#!/bin/sh
exec "$HOST_DIR/bin/qemu-system-aarch64" \
  -M virt -cpu cortex-a53 -nographic -smp 2 -m 1024 \
  -kernel "\$(dirname "\$0")/Image" \
  -append "rootwait root=/dev/vda console=ttyAMA0" \
  -netdev user,id=eth0 -device virtio-net-device,netdev=eth0 \
  -drive file="\$(dirname "\$0")/rootfs.ext4",if=none,format=raw,id=hd0 \
  -device virtio-blk-device,drive=hd0
EOF
chmod 0755 "$BINARIES_DIR/start-qemu.sh"
