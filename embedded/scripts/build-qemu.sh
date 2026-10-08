#!/usr/bin/env bash
set -euo pipefail

ROOT=/workspace
BUILDROOT=/opt/buildroot
OUTPUT=/output
EXPORT_DIR="$ROOT/output/qemu-aarch64"
export BR2_EXTERNAL="$ROOT/embedded/buildroot-external"

cmake -S "$ROOT/embedded/apps/omni-core" -B /tmp/omni-core-build
cmake --build /tmp/omni-core-build --parallel
ctest --test-dir /tmp/omni-core-build --output-on-failure

make -C "$BUILDROOT" O="$OUTPUT" omni_qemu_aarch64_defconfig
make -C "$BUILDROOT" O="$OUTPUT" -j"$(nproc)"

bash "$ROOT/embedded/scripts/test-qemu.sh" "$OUTPUT"

mkdir -p "$EXPORT_DIR"
cp "$OUTPUT/.config" "$EXPORT_DIR/buildroot.config"
cp "$OUTPUT/images/Image" "$EXPORT_DIR/Image"
cp "$OUTPUT/images/rootfs.ext4" "$EXPORT_DIR/rootfs.ext4"
cp "$OUTPUT/images/start-qemu.sh" "$EXPORT_DIR/start-qemu.sh"
cp "$OUTPUT/qemu-boot.log" "$EXPORT_DIR/qemu-boot.log"
du -h "$OUTPUT/images/Image" "$OUTPUT/images/rootfs.ext2" > "$EXPORT_DIR/sizes.txt"
du -sh "$OUTPUT/target" >> "$EXPORT_DIR/sizes.txt"
(cd "$EXPORT_DIR" && sha256sum Image rootfs.ext4 > SHA256SUMS)
echo "Artifacts exported to $EXPORT_DIR"
