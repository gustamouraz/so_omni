#!/usr/bin/env bash
set -euo pipefail

OUTPUT="${1:-/output}"
LOG="$OUTPUT/qemu-boot.log"

set +e
(
  sleep 5
  printf 'root\n'
  sleep 1
  printf 'stty -echo\n'
  sleep 1
  printf 'PS1=\n'
  printf 'if test -s /run/omni/state.json; then echo __OMNI_STATE_READY__; else echo __OMNI_STATE_MISSING__; ls -la /run/omni /run/omni-core.pid 2>&1; cat /run/omni-core.pid 2>&1; echo __OMNI_STDIO__; /usr/bin/omni-core </dev/null; echo __OMNI_MANUAL__; /usr/bin/omni-core /tmp/ocmd /tmp/ostate >/tmp/olog 2>&1 & sleep 1; ls -l /tmp/ocmd /tmp/ostate; cat /tmp/olog; ps | grep omni; fi\n'
  printf 'if test -f /usr/share/omni/omni-icon.png; then echo __OMNI_ICON_READY__; else echo __OMNI_ICON_MISSING__; fi\n'
  printf 'grep MemTotal /proc/meminfo\n'
  sleep 2
) | (cd "$OUTPUT/images" && timeout 20s ./start-qemu.sh) >"$LOG" 2>&1
status=${PIPESTATUS[1]}
set -e

if [[ $status -ne 0 && $status -ne 124 ]]; then
  tail -n 100 "$LOG"
  exit "$status"
fi
if ! grep -q "Starting omni-core: OK" "$LOG"; then
  echo "omni-core did not start during the QEMU boot test"
  tail -n 120 "$LOG"
  exit 1
fi
if ! grep -Eq '^(# )?__OMNI_STATE_READY__' "$LOG" || ! grep -Eq '^(# )?__OMNI_ICON_READY__' "$LOG"; then
  echo "QEMU runtime checks did not complete"
  tail -n 120 "$LOG"
  exit 1
fi
echo "QEMU boot test passed: service state and official icon are available"
