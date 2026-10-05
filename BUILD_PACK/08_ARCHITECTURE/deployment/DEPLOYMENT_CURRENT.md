# DEPLOYMENT_CURRENT.md

## Purpose

Evidence-based snapshot of how the current v1 Capstone application is deployed.

Captured from the live `capstone-ai` host.

---

## 1. Host

Host name:

`capstone-ai`

Hosting:

Hetzner VPS

Current stack is a single-server Docker deployment with Caddy installed directly on the host.

Primary configuration locations:

- Docker Compose: `/root/ai-capstone/docker-compose.yml`
- Caddy: `/etc/caddy/Caddyfile`

---

## 2. Containers

| Container | Image | Restart policy | Published ports |
|---|---|---|---|
| `ai-capstone_postgres_1` | `postgres:15` | `always` | `5432:5432` |
| `ai-capstone_nocodb_1` | `nocodb/nocodb:latest` | `always` | `8080:8080` |
| `ai-capstone_n8n_1` | `n8nio/n8n` | `always` | `5678:5678` |
| `appsmith` | `index.docker.io/appsmith/appsmith-ee` | `unless-stopped` | `9080:80`, `9443:443` |

All containers are currently attached to:

`ai-capstone_default`

Observed state at capture: all four containers running; Appsmith reported healthy.

---

## 3. Persistence

Docker named volumes:

| Volume | Mounted into |
|---|---|
| `postgres_data` | `/var/lib/postgresql/data` |
| `n8n_data` | `/home/node/.n8n` |
| `appsmith-stacks` | `/appsmith-stacks` |

NocoDB has no directly mounted named volume in the Compose file. Its database connection is supplied through `NC_DB` and points to the PostgreSQL service.

---

## 4. Service dependency graph

```text
                  Internet
                     |
                  80 / 443
                     |
                   Caddy
          ___________|____________
         |                        |
         v                        v
n8n.flowagentai.website     appsmith.flowagentai.website
         |                        |
  127.0.0.1:5678            127.0.0.1:9080
         |                        |
         v                        |
        n8n <---------------------+
         |
         +----> Google Sheets / Google APIs
         |
         +----> OpenAI API

Docker network: ai-capstone_default

NocoDB --------------------> PostgreSQL
```

---

## 5. Reverse proxy

Caddy is active as a host-level system service.

Nginx and Apache are inactive.

Current Caddy routes:

```caddy
{
    servers {
        protocols h1 h2
    }
}

n8n.flowagentai.website {
    reverse_proxy 127.0.0.1:5678
}

appsmith.flowagentai.website {
    reverse_proxy 127.0.0.1:9080
}
```

Caddy is listening on host ports:

- 80
- 443

Caddy's admin endpoint is also listening on loopback port `2019`.

---

## 6. Directly published Docker ports

In addition to Caddy, the current Docker Compose file binds these service ports to all interfaces:

- PostgreSQL: `0.0.0.0:5432` and IPv6 equivalent
- n8n: `0.0.0.0:5678` and IPv6 equivalent
- NocoDB: `0.0.0.0:8080` and IPv6 equivalent
- Appsmith HTTP: `0.0.0.0:9080` and IPv6 equivalent
- Appsmith HTTPS: `0.0.0.0:9443` and IPv6 equivalent

This is the **current deployment state**, not a required v2 architecture.

For a future deployment, only ports that genuinely require direct public access should remain externally bound. Reverse-proxied services can generally be bound to loopback or an internal Docker network, subject to the final v2 deployment design and firewall policy.

---

## 7. Docker Compose source

Sanitized current Compose structure:

```yaml
version: "3"

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: <REDACTED>
      POSTGRES_PASSWORD: <REDACTED>
      POSTGRES_DB: <REDACTED>
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nocodb:
    image: nocodb/nocodb:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      NC_DB: <REDACTED>
    depends_on:
      - postgres

  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_SECURE_COOKIE=<REDACTED>
      - N8N_ENCRYPTION_KEY=<REDACTED>
      - N8N_EDITOR_BASE_URL=<REDACTED>
      - WEBHOOK_URL=<REDACTED>
      - N8N_PROXY_HOPS=<REDACTED>
    volumes:
      - n8n_data:/home/node/.n8n

  appsmith:
    image: index.docker.io/appsmith/appsmith-ee
    container_name: appsmith
    restart: unless-stopped
    ports:
      - "9080:80"
      - "9443:443"
    volumes:
      - appsmith-stacks:/appsmith-stacks

volumes:
  postgres_data:
  n8n_data:
  appsmith-stacks:
```

The Build Pack should preserve only this **redacted** version unless the actual secret-bearing Compose file is stored in a separate secured infrastructure system.

---

## 8. Environment-variable configuration

Deployment-defined variables:

### PostgreSQL

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

### NocoDB

- `NC_DB`

### n8n

- `N8N_SECURE_COOKIE`
- `N8N_ENCRYPTION_KEY`
- `N8N_EDITOR_BASE_URL`
- `WEBHOOK_URL`
- `N8N_PROXY_HOPS`

Appsmith has no custom environment block in the captured Compose file.

See:

`09_DEPENDENCIES/ENVIRONMENT_VARIABLES.md`

---

## 9. Startup / restore order

Logical restore order:

1. Docker Engine available.
2. Docker network / Compose project created.
3. PostgreSQL starts and mounts `postgres_data`.
4. NocoDB starts after PostgreSQL.
5. n8n starts and mounts `n8n_data`.
6. Appsmith starts and mounts `appsmith-stacks`.
7. Caddy routes the public hostnames to n8n/Appsmith.
8. DNS points the two `flowagentai.website` hostnames to the host.

n8n credential restoration additionally depends on having the original `N8N_ENCRYPTION_KEY`.

---

## 10. Reproducibility observations

### Image pinning

PostgreSQL is pinned to major version `15`.

The current Compose file does **not** pin immutable versions for:

- `nocodb/nocodb:latest`
- `n8nio/n8n`
- `appsmith/appsmith-ee`

A fresh pull at a later date could therefore produce different software versions.

For v2 production deployment, use explicit tested image/application versions or another reproducible release mechanism.

### Compose discovery

`docker compose ls` returned no projects during capture, even though:

- container names use the `ai-capstone_*` Compose naming pattern;
- the network is `ai-capstone_default`;
- `/root/ai-capstone/docker-compose.yml` exists.

This is a capture observation only. It may reflect how the stack was originally launched (for example a different/legacy Compose command or metadata context). Do not rely on `docker compose ls` alone to discover the current stack.

---

## 11. Current-v1 vs v2 migration boundary

The goal of preserving this file is **not** to require v2 to reproduce the same deployment topology.

Must preserve:

- current service responsibilities;
- data/config behavior;
- secret requirements;
- persistent-state dependencies;
- externally visible application behavior needed for regression.

May change in v2:

- Appsmith;
- NocoDB;
- Google Sheets as runtime config storage;
- host/provider;
- container topology;
- direct port exposure;
- image choices;
- reverse-proxy implementation;
- model provider.

The new architecture should be selected only after the v1 behavior map and Columbia-approved scope are finalized.
