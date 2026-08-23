# CockroachDB Setup

Distributed 3-node CockroachDB cluster for local development.

## Getting Started

```bash
# Start cluster
docker-compose up -d

# Stop cluster
docker-compose down

# Stop and remove data
docker-compose down -v

# View logs
docker-compose logs -f cockroach-1

# Access CockroachDB shell
cockroach sql --insecure --host=localhost:26257

# UI Dashboard
http://localhost:8080  (Node 1)
http://localhost:8081  (Node 2)
http://localhost:8082  (Node 3)
```

## Connection String

```
postgresql://root@localhost:26257/marble_db?sslmode=disable
```

## Features

- **3-node cluster** - Distributed, highly available
- **Auto-replication** - 3x replication by default
- **PostgreSQL compatible** - Drop-in replacement
- **Built-in health checks** - Automatic failover
- **Dashboard UI** - Monitor cluster health

## Scale Up

Add more nodes by duplicating services (cockroach-4, etc.) with incremented ports.

