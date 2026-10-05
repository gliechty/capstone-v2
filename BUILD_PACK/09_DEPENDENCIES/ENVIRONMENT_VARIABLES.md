# ENVIRONMENT_VARIABLES.md

## Purpose

This document inventories environment-variable **names and roles only** for the current v1 Capstone deployment.

**No secret values are preserved here.** Secret-bearing values must remain in a secure secret store / deployment environment and must not be committed to the Build Pack or Git repository.

## Current deployment services

The live v1 stack contains four Docker containers:

- PostgreSQL 15
- NocoDB
- n8n
- Appsmith EE

Caddy runs as a host-level system service rather than a Docker container.

---

## 1. PostgreSQL

Container: `ai-capstone_postgres_1`

### Deployment-config variables

| Variable | Purpose | Secret-bearing? | Required for migration? |
|---|---|---:|---:|
| `POSTGRES_USER` | Initial PostgreSQL application/admin user | Potentially sensitive | Yes |
| `POSTGRES_PASSWORD` | Password for PostgreSQL user | **Yes** | Yes |
| `POSTGRES_DB` | Initial/default PostgreSQL database | No | Yes |

### Image/runtime variables observed

| Variable | Role |
|---|---|
| `PGDATA` | PostgreSQL data-directory location |
| `PG_MAJOR` | PostgreSQL major version metadata |
| `PG_VERSION` | PostgreSQL image version metadata |
| `GOSU_VERSION` | Image/runtime helper metadata |
| `LANG` | Runtime locale |
| `PATH` | Container executable path |

Persistent volume:

`postgres_data:/var/lib/postgresql/data`

---

## 2. NocoDB

Container: `ai-capstone_nocodb_1`

### Deployment-config variables

| Variable | Purpose | Secret-bearing? | Required for migration? |
|---|---|---:|---:|
| `NC_DB` | NocoDB database connection configuration; current deployment points NocoDB to PostgreSQL | **May contain credentials** | Yes |

### Image/runtime variables observed

| Variable | Role |
|---|---|
| `NC_DOCKER` | NocoDB Docker-runtime flag/config |
| `NC_TOOL_DIR` | NocoDB internal tool directory |
| `PORT` | Container service port |
| `NODE_ENV` | Node runtime environment |
| `NODE_VERSION` | Image/runtime metadata |
| `YARN_VERSION` | Image/runtime metadata |
| `PATH` | Container executable path |
| `LITESTREAM_RETENTION` | NocoDB image/runtime persistence-related setting |
| `LITESTREAM_RETENTION_CHECK_INTERVAL` | NocoDB image/runtime persistence-related setting |
| `LITESTREAM_S3_SKIP_VERIFY` | NocoDB image/runtime persistence-related setting |
| `LITESTREAM_SNAPSHOT_INTERVAL` | NocoDB image/runtime persistence-related setting |
| `LITESTREAM_SYNC_INTERVAL` | NocoDB image/runtime persistence-related setting |

No Docker volume is mounted directly into the NocoDB container in the current Compose file. Its application data connection is configured through `NC_DB`.

---

## 3. n8n

Container: `ai-capstone_n8n_1`

### Deployment-config variables

| Variable | Purpose | Secret-bearing? | Required for migration? |
|---|---|---:|---:|
| `N8N_SECURE_COOKIE` | Controls secure-cookie behavior | No | Yes |
| `N8N_ENCRYPTION_KEY` | Encrypts stored n8n credentials | **Yes — critical** | **Yes** |
| `N8N_EDITOR_BASE_URL` | Public editor URL used by n8n | No | Yes |
| `WEBHOOK_URL` | Base public URL for generated webhook endpoints | No | Yes |
| `N8N_PROXY_HOPS` | Trust depth for reverse-proxy headers | No | Yes |

### Image/runtime variables observed

| Variable | Role |
|---|---|
| `N8N_RELEASE_TYPE` | n8n runtime/release metadata |
| `NODE_ENV` | Node runtime environment |
| `NODE_PATH` | Node module lookup path |
| `NODE_VERSION` | Image/runtime metadata |
| `NPM_CONFIG_UPDATE_NOTIFIER` | npm runtime setting |
| `SHELL` | Container shell |
| `PATH` | Container executable path |

Persistent volume:

`n8n_data:/home/node/.n8n`

### Important migration note

`N8N_ENCRYPTION_KEY` is required to decrypt credentials stored in the existing n8n data volume/database. Preserve the real value securely **outside** the Build Pack if the existing n8n credential store ever needs to be restored.

Do not put the value in:

- Markdown documentation
- `.env.example`
- source control
- agent prompts
- screenshots

---

## 4. Appsmith EE

Container: `appsmith`

The Compose file does not define custom Appsmith environment variables. The following names are present in the running Appsmith EE container and are primarily Appsmith/platform runtime settings.

| Variable | Role / classification |
|---|---|
| `APPSMITH_AIRGAP_ENABLED` | Appsmith deployment/runtime setting |
| `APPSMITH_CLOUD_SERVICES_BASE_URL` | Appsmith vendor service endpoint configuration |
| `APPSMITH_BETTERBUGS_API_KEY` | Appsmith/vendor integration key; **treat as secret** |
| `APPSMITH_SEGMENT_CE_KEY` | Appsmith analytics/telemetry key; **treat as secret-like** |
| `KEYGEN_LICENSE_VERIFICATION_KEY` | Appsmith licensing/runtime key; **treat as secret-like** |
| `ALLOY_CONFIG_PATH` | Internal runtime config path |
| `IN_DOCKER` | Docker runtime flag |
| `WWW_PATH` | Web application path |
| `NSS_WRAPPER_GROUP` | Container/runtime configuration |
| `NSS_WRAPPER_PASSWD` | Container/runtime configuration |
| `NSS_WRAPPER_SYMLINK` | Container/runtime configuration |
| `LANG` | Runtime locale |
| `LC_ALL` | Runtime locale |
| `TMP` | Temporary-file path |
| `PATH` | Container executable path |

Persistent volume:

`appsmith-stacks:/appsmith-stacks`

These image-level variables should not automatically be copied into a future `.env` file. Recreate only variables explicitly required by the chosen Appsmith deployment/version.

---

## 5. Caddy

Caddy is installed as a host service.

No Caddy environment-variable dependency was identified in the captured configuration. The active configuration is file-based at:

`/etc/caddy/Caddyfile`

---

## 6. Application credentials not represented as Docker environment variables

The current application also depends on credentials stored inside platform credential stores rather than ordinary container environment variables.

Known categories:

- n8n Google Sheets / Google API credential reference(s)
- n8n OpenAI credential reference
- Appsmith datasource / API credential references preserved by the Appsmith installation

The Build Pack should preserve:

- credential **type**
- credential **consumer**
- which workflow/datasource uses it

It should **not** preserve secret tokens, passwords, OAuth refresh tokens, private keys, or API-key values.

---

## 7. Minimal future `.env` contract

A future deployment can use an environment contract such as:

```dotenv
# PostgreSQL
POSTGRES_USER=<set-in-secret-store>
POSTGRES_PASSWORD=<set-in-secret-store>
POSTGRES_DB=<set-for-environment>

# NocoDB
NC_DB=<set-in-secret-store-or-derived-connection-string>

# n8n
N8N_SECURE_COOKIE=true
N8N_ENCRYPTION_KEY=<set-in-secret-store>
N8N_EDITOR_BASE_URL=<public-n8n-url>
WEBHOOK_URL=<public-n8n-url>
N8N_PROXY_HOPS=1
```

This is a **contract**, not a copy of the current secret values.
