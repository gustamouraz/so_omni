[CmdletBinding()]
param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\output\ac8227a-evidence")
)

$ErrorActionPreference = 'Stop'
$adb = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adb) {
  throw "ADB não foi encontrado. Instale Android Platform Tools e habilite a depuração USB na central."
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
& $adb.Source start-server | Out-Null
& $adb.Source wait-for-device

$state = (& $adb.Source get-state).Trim()
if ($state -ne 'device') {
  throw "A central não autorizou ADB (estado: $state). Confirme o aviso de depuração na tela."
}

$commands = [ordered]@{
  'properties.txt' = 'getprop'
  'uname.txt' = 'uname -a'
  'cmdline.txt' = 'cat /proc/cmdline'
  'partitions.txt' = 'cat /proc/partitions'
  'by-name.txt' = 'ls -la /dev/block/platform/soc/11230000.mmc/by-name'
  'mounts.txt' = 'mount; df -h'
  'identity.txt' = 'id; su -c id'
}

foreach ($entry in $commands.GetEnumerator()) {
  & $adb.Source shell $entry.Value | Out-File -FilePath (Join-Path $OutputDirectory $entry.Key) -Encoding utf8
}

Write-Host "Coleta somente leitura concluída em: $OutputDirectory"
Write-Host "Ainda não foi feita cópia nem gravação da eMMC."
