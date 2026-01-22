# Database status (Jan 2026)

- The Azure PostgreSQL Flexible Server used for auth was deleted (resource group `aedx-rg`, server `aedxpg8136`).
- App logic for DB auth and API routes remains in code (`src/lib/db.ts`, `src/lib/auth/server.ts`, `src/app/api/auth/*`). You can re-enable it later.

## How to recreate the DB (Azure CLI, SQL API)

1) Pick region (e.g., eastus2) and set names:
   ```bash
   $suffix=$(python - <<'PY'
import random
print(random.randint(1000,9999))
PY)
   AZ_PG_RG=aedx-rg
   AZ_PG_NAME=aedxpg$suffix
   AZ_PG_ADMIN=carmy_admin
   AZ_PG_LOCATION=eastus2
   ```
2) Create RG:
   ```bash
   az group create --name $AZ_PG_RG --location $AZ_PG_LOCATION
   ```
3) Register provider (one-time per subscription):
   ```bash
   az provider register --namespace Microsoft.DBforPostgreSQL
   ```
4) Create server (burstable B1ms, 32 GB; replace password):
   ```bash
   az postgres flexible-server create \
     --resource-group $AZ_PG_RG \
     --name $AZ_PG_NAME \
     --admin-user $AZ_PG_ADMIN \
     --admin-password "YourStrongPassword123!" \
     --sku-name Standard_B1ms \
     --tier Burstable \
     --storage-size 32 \
     --version 15 \
     --public-access 0.0.0.0 \
     --location $AZ_PG_LOCATION
   ```
5) Create database:
   ```bash
   az postgres flexible-server db create \
     --resource-group $AZ_PG_RG \
     --server-name $AZ_PG_NAME \
     --database-name aedx_db
   ```
6) Grab connection string:
   ```bash
   az postgres flexible-server show-connection-string \
     --server-name $AZ_PG_NAME \
     --admin-user $AZ_PG_ADMIN
   ```
7) Set env vars in `website/.env.local`:
   ```
   DATABASE_URL=postgresql://carmy_admin:YourStrongPassword123!@<host>:5432/aedx_db?sslmode=require
   AUTH_SECRET=<generate_a_long_random_secret>
   ```
8) Start server if stopped, then run `npm run build`.

## Cost reminder
- B1ms is paid. Stop when not in use:
  ```bash
  az postgres flexible-server stop --name $AZ_PG_NAME --resource-group $AZ_PG_RG
  ```
- Delete RG to avoid charges:
  ```bash
  az group delete --name $AZ_PG_RG --yes
  ```

## Current login behavior (no DB)
- Auth is hard-coded for Carmy only.
- Credentials (change in `src/hooks/useAuth.ts`):
  - user: `carmy`
  - pass: `carmylovesfood`
- Login uses localStorage token; no server DB calls.

## Future: menu + notification + AI idea
- Once DB is re-enabled, you can store menu selections and trigger notifications.
- For AI recipe/shopping list: add a small API route that takes the dish text, calls an LLM (e.g., Azure OpenAI), returns a short ingredient list + prep steps.
