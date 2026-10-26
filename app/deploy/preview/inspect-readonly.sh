#!/bin/sh
# No environment or credential dumps; no mutations.
set -eu
hostname
uname -sr
uptime
free -m
df -h / /var/lib/docker 2>/dev/null || true
ss -lnt
systemctl is-active caddy docker || true
caddy version || true
docker version --format '{{.Server.Version}}' || true
docker ps --format '{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' || true
docker stats --no-stream --format '{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}' || true
if test -r /etc/caddy/Caddyfile; then
 grep -E '^[[:space:]]*[A-Za-z0-9.-]+[[:space:]]*\{|^[[:space:]]*reverse_proxy[[:space:]]+127[.]0[.]0[.]1:[0-9]+[[:space:]]*$' /etc/caddy/Caddyfile || true
fi
