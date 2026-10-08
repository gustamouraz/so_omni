param([switch]$Clean)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$image = "so-omni-buildroot:2026.05.1"
$outputVolume = "so-omni-buildroot-output"
$downloadVolume = "so-omni-buildroot-downloads"

if ($Clean) {
    docker volume inspect $outputVolume *> $null
    if ($LASTEXITCODE -eq 0) {
        docker volume rm $outputVolume | Out-Null
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
}

docker build --tag $image --file "$repo\embedded\docker\Dockerfile" "$repo\embedded\docker"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker volume create $outputVolume | Out-Null
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker volume create $downloadVolume | Out-Null
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker run --rm --mount "type=bind,source=$repo,target=/workspace" --mount "type=volume,source=$outputVolume,target=/output" --mount "type=volume,source=$downloadVolume,target=/opt/buildroot/dl" $image bash /workspace/embedded/scripts/build-qemu.sh
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
