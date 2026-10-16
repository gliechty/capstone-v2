# Private Hetzner staging preparation — 2026-10-16

Local implementation and deployment proposal only. No server mutations, DNS changes, provider calls, commits or pushes. Owner accepted the focused UI corrections; M3 and recommendation quality remain open.

## Observed setup and inspection limits

Owner identifies capstone-ai / 89.167.6.61, 4 vCPU, 8 GB RAM, 40 GB disk. Capacity availability is NOT verified. Local SSH has only known_hosts/known_hosts.old, no matching config/default key or active agent. Existing trusted-host BatchMode connection as default user guyli again failed Permission denied (publickey,password); no remote command ran. Live services, free resources, Caddy version/config and port 3201 availability remain blocked by authentication.

Reused archived evidence: BUILD_PACK/08_ARCHITECTURE/deployment/DEPLOYMENT_CURRENT.md and Caddyfile record host-level Caddy at /etc/caddy/Caddyfile, Compose at /root/ai-capstone/docker-compose.yml, Appsmith 9080/9443, n8n 5678, NocoDB 8080 and Postgres 5432, with existing network/volumes. These are historical facts, not a new host inventory. Read-only DNS check this package: n8n.flowagentai.website and appsmith.flowagentai.website resolve to 89.167.6.61; preview.flowagentai.website returns NXDOMAIN.

Prepared read-only inventory script: app/deploy/preview/inspect-readonly.sh. It checks resource availability, listeners, named services/container health and only Caddy site/upstream lines. It never prints environments, private keys or full credential-bearing configuration. Do not assume archived healthy state still holds.

## Implemented preview boundary

A separate build (CAPSTONE_BUILD_TARGET=private-preview) produces .next-preview and embeds the preview capability. Runtime CAPSTONE_PREVIEW_MODE=synthetic is also required. Normal builds return 404 for /preview and /api/preview-health, even if client URLs ask for simulation. Any preview build OR nonempty preview runtime setting disables paid-provider readiness and returns no API key, including misconfiguration. The normal controller and output-validation safeguards are unchanged. Normal /results continues its existing flow; explicitly enabled preview redirects /results to /preview.

Actual Results presentation is shared, not copied. Preview uses the real assessment session/schema, questionnaire and deterministic scoring endpoint. The explicit sample loader replaces only the preview tab's answers with the two-answer synthetic Manufacturing sample; its button says so. A separate staging origin keeps local/production browser sessions isolated. Scores stay authoritative. Authored fixtures are visibly labeled synthetic in the persistent banner, executive summary, gaps/actions and source references. They are NOT passed off as validated/generated advice, not derived from retained private outputs, and do not run retrieval. Use synthetic input only.

Controls: success, timeout, error; 0/2/6/12-second delay. Simulation runs in the browser, with no generation endpoint request. Cancellation clears the timer. Refresh/navigation cannot auto-retry; a receipt permits explicit recovery. Changing assessment invalidates content. These controls demonstrate UI behavior, not provider latency or server fault injection. Source dialog links point to example.org and are labeled authored examples. Build health returns synthetic mode, billable=false, config version and release identity.

## Prepared deployment files

- app/deploy/preview/Dockerfile: separate Node 24 preview build; production dependencies; non-root runtime. No local .env or evidence in image.
- app/.dockerignore: allowlist of build inputs; excludes .local, ledgers, private responses, environment files and repository metadata.
- app/deploy/preview/entrypoint.mjs: refuses any OpenAI key or live-provider setting; takes build identity from the image-owned release file.
- app/deploy/preview/compose.yaml: new project capstone-v2-preview, loopback 127.0.0.1:3201, 1 CPU / 768 MB limit, read-only filesystem, bounded tmpfs/logs/PIDs, dropped capabilities, no new privileges, internal network, no existing volumes/networks.
- app/deploy/preview/Caddyfile.fragment: proposed new HTTPS site, whole-site Basic authentication including assets/APIs, no cache/indexing, bounded bodies, credentials stripped before upstream. No existing site replacement.
- app/scripts/preview-release.mjs: content-derived source identifier including uncommitted build inputs, independent of Git HEAD. Recompute after any source change.
- app/deploy/preview/release.env.example: image reference placeholder only; no secret.

Docker Compose config validation is available locally, but Docker Desktop's Linux daemon is not running. Container build/runtime and Caddy validation are therefore NOT claimed. The Next production preview artifact is tested locally. Before deployment, resolve Node base image to an immutable digest, build on an approved Linux Docker builder, record image digest and smoke-test that exact image under the proposed resource/read-only/network constraints. No untested image should be deployed.

## Exact owner prerequisites

1. Configure C:\Users\guyli\.ssh\config with Host capstone-ai, HostName 89.167.6.61, User <existing-authorized-server-user>, IdentityFile <path-to-existing-authorized-key>, IdentitiesOnly yes. Unlock the key locally if encrypted; do not send it in chat. If no authorized key exists, the owner/admin must provision its public key through a trusted console. Then read-only inventory can resume under the existing authorization.
2. After deployment approval, create an A record: name preview, zone flowagentai.website, value 89.167.6.61, TTL 300 (or provider minimum). Do not add an AAAA record without verified IPv6 routing. Confirm domain control and CAA/ACME eligibility. Existing A records remain unchanged.
3. Choose individual reviewer usernames and passwords privately. Generate bcrypt hashes interactively with caddy hash-password; store only username/hash lines in /etc/caddy/capstone-preview-users, readable by Caddy, outside Git. HTTPS required; never use real OpenAI credentials. Caddy >=2.8 uses basic_auth; inspect installed version before applying the fragment ([official authentication docs](https://caddyserver.com/docs/caddyfile/directives/basic_auth)).
4. Approve isolated preview resource allocation after free-memory/disk/port inspection. If insufficient, stop and propose adjustment; do not remove or resize existing services.

## Concrete server changes proposed for approval — NOT executed

1. Inventory current host and snapshot existing service health/site routes; back up only the Caddy configuration being extended. Preserve /root/ai-capstone, its Compose/network/volumes and all current services.
2. Prepare /opt/capstone-v2-preview/releases/<release-id> with reviewed deployment files and immutable image reference. Build off-host to avoid CPU/memory contention; transfer the tested image. No SME data, keys, local ledgers or sessions transferred.
3. Run docker compose --env-file release.env -f compose.yaml config --quiet; then, only after approval, up -d for this new project. Do not run commands against the legacy Compose project. Check loopback health and build ID before adding public routing. Verify direct generation POST cannot become available and outbound provider access is unavailable. An internal Docker network provides external isolation ([Docker network reference](https://docs.docker.com/reference/compose-file/networks/)); prove actual ingress/egress behavior on the tested image/host before exposure.
4. Add only the preview site fragment plus reviewer hash file. Preserve existing global settings/sites. Validate the complete proposed Caddy configuration with caddy validate, then reload (not restart) Caddy after approval. Check old Appsmith/n8n routes before/after. Configure DNS only when separately approved.
5. Verify HTTPS certificate; unauthenticated requests to /, /preview, /assessment, /_next assets, /api/assessment-score and /api/preview-health must return 401. Authenticated health must show expected release/synthetic/non-billable flags. Check external port 3201 is unreachable; validate authenticated mobile/desktop/source dialogs, delayed outcomes, refresh/recovery. Keep credentials out of logs/command histories. Do not claim deployable until these host checks pass.

## Rollback

Remove only the new preview site/import, validate and reload Caddy; verify legacy routes remain healthy. Stop only the capstone-v2-preview project service (compose stop preview); no down -v, pruning, shared network/volume deletion or database migration. For revision rollback, set release.env to the previous recorded immutable preview image and up -d only this project after health checks. Revert only preview DNS if requested. Preserve health/evidence and archived image identity. Whole-server snapshot restoration is inappropriate for routine preview rollback because it would affect existing services/data.

## Review status

Scoped UI accepted; preview preparation pending review/deployment approval. GROUNDING-001 unsupported whistleblower citation and SCORE-COMPARISON-001 unresolved manual-score comparison stay open. Synthetic fixtures prove neither source support nor score-comparison provenance. Reports, M3.6 experiments and broader M3 acceptance remain out of scope.

## Reviewable command sequence (templates; not run on server)

From app on an approved Linux builder, after resolving the Node image digest:

    node scripts/preview-release.mjs
    docker build -f deploy/preview/Dockerfile --build-arg NODE_IMAGE=node:24-bookworm-slim@sha256:<verified-digest> --build-arg RELEASE_ID=<reported-source-id> -t capstone-v2-preview:<reported-source-id> .
    docker image inspect capstone-v2-preview:<reported-source-id> --format '{{.Id}}'

Copy only the tested image and reviewed deploy/preview files to the isolated release directory; record immutable image identity in release.env. Before server approval, run the image with the supplied Compose limits on the builder and perform all health/auth/egress/read-only smoke checks that are possible there. The current local Docker daemon is unavailable, so this remains an explicit verification prerequisite.

After approval, in that isolated directory only:

    docker compose --env-file release.env -f compose.yaml config --quiet
    docker compose --env-file release.env -f compose.yaml up -d preview
    curl --fail http://127.0.0.1:3201/api/preview-health

After adding only the approved site block and hash file, validate the FULL existing-plus-preview Caddyfile before reload:

    caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
    systemctl reload caddy

Use an authenticated browser for reviewer smoke checks, keeping credentials out of command histories. Test unauthenticated 401s separately with curl; do not include Authorization headers in evidence. Rollback command for the isolated service:

    docker compose --env-file release.env -f compose.yaml stop preview

Remove only the preview site, revalidate/reload Caddy, and verify old routes. No legacy Compose command, service restart, firewall edit, database migration, volume deletion or DNS change was executed by this package.
