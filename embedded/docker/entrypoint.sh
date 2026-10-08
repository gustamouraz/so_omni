#!/bin/sh
set -eu

mkdir -p /output /opt/buildroot/dl
if [ "$(stat -c %u /output)" -ne 1000 ]; then
  chown -R builder:builder /output
fi
if [ "$(stat -c %u /opt/buildroot/dl)" -ne 1000 ]; then
  chown -R builder:builder /opt/buildroot/dl
fi
exec runuser -u builder -- "$@"
