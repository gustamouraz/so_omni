$ErrorActionPreference = "Stop"
$image = "so-omni-buildroot:2026.05.1"
$outputVolume = "so-omni-buildroot-output"

docker run --rm -it --mount "type=volume,source=$outputVolume,target=/output" $image bash -lc "cd /output/images && ./start-qemu.sh"
