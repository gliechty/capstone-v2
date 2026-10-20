#!/bin/sh
set -eu
release="$1"
case "$release" in mosaic-[a-f0-9]*) ;; *) echo 'Invalid release'; exit 1;; esac
cd "$(dirname "$0")/../.."
test -s /opt/mosaic-app/credential.env
test -s /opt/mosaic-app/operating.env
# Separate, persistent ledgers. Existing files are never reset.
mkdir -p /opt/mosaic-app/budget
for file in public.json verification-20261019.json; do
 if ! test -e "/opt/mosaic-app/budget/$file"; then (set -C; printf '[]' > "/opt/mosaic-app/budget/$file"); fi
done
chown -R 1000:1000 /opt/mosaic-app/budget
chmod 700 /opt/mosaic-app/budget
chmod 600 /opt/mosaic-app/budget/*.json
# Only this new network receives provider egress; no existing chains are flushed.
if ! docker network inspect mosaic-ai-egress >/dev/null 2>&1; then docker network create --subnet 172.30.42.0/24 mosaic-ai-egress >/dev/null; fi
subnet=$(docker network inspect mosaic-ai-egress --format '{{(index .IPAM.Config 0).Subnet}}')
test "$subnet" = '172.30.42.0/24'
ips=$(getent ahostsv4 api.openai.com | awk '{print $1}' | sort -u)
test -n "$ips"
iptables -N MOSAIC_AI_EGRESS 2>/dev/null || true
iptables -C DOCKER-USER -s "$subnet" -j MOSAIC_AI_EGRESS 2>/dev/null || iptables -I DOCKER-USER 1 -s "$subnet" -j MOSAIC_AI_EGRESS
# Insert current provider addresses ahead of the fail-closed final DROP.
iptables -C MOSAIC_AI_EGRESS -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN 2>/dev/null || iptables -I MOSAIC_AI_EGRESS 1 -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN
for ip in $ips; do iptables -C MOSAIC_AI_EGRESS -d "$ip" -p tcp --dport 443 -j RETURN 2>/dev/null || iptables -I MOSAIC_AI_EGRESS 1 -d "$ip" -p tcp --dport 443 -j RETURN; done
iptables -C MOSAIC_AI_EGRESS -j DROP 2>/dev/null || iptables -A MOSAIC_AI_EGRESS -j DROP
iptables -C INPUT -s "$subnet" -j DROP 2>/dev/null || iptables -I INPUT 1 -s "$subnet" -j DROP
DOCKER_BUILDKIT=0 docker build -f deploy/app/Dockerfile --build-arg NODE_IMAGE=node@sha256:a5f4366e834695d5f363b920c104953a535d3a9864d1bdf74566a0ebe01daee5 --build-arg RELEASE_ID="$release" -t "mosaic-app:$release" . > "/root/$release-build.log" 2>&1
image=$(docker image inspect "mosaic-app:$release" --format '{{.Id}}')
cp -p /opt/mosaic-app/compose.yaml /opt/mosaic-app/compose.previous.yaml
cp -p /opt/mosaic-app/release.env /opt/mosaic-app/release.previous.env
cp -p /etc/caddy/Caddyfile /etc/caddy/Caddyfile.before-m3
cp deploy/app/compose.yaml /opt/mosaic-app/compose.yaml
printf 'APP_IMAGE=%s\n' "$image" > /opt/mosaic-app/release.env
cd /opt/mosaic-app
docker compose --env-file release.env config --quiet
docker compose --env-file release.env up -d app
ip=$(docker inspect mosaic-app-app-1 --format '{{(index .NetworkSettings.Networks "mosaic-app_app_only").IPAddress}}')
for i in 1 2 3 4 5 6 7 8 9 10; do if curl -fsS "http://$ip:3000/" -o /dev/null; then break; fi; sleep 2; done
curl -fsS "http://$ip:3000/" -o /dev/null
python3 - "$ip" <<'PY'
import re,sys
from pathlib import Path
p=Path('/etc/caddy/Caddyfile');s=p.read_text()
s,n=re.subn(r'reverse_proxy 172\.[0-9.]+:3000', 'reverse_proxy '+sys.argv[1]+':3000',s)
assert n==1
p.write_text(s)
PY
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl reload caddy
printf 'Deployed %s %s\n' "$release" "$image"
