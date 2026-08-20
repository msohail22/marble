# Marble Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["🌐 Browser<br/>React SPA"]
        Mobile["📱 Mobile Clients"]
        External["🔗 External APIs"]
    end

    subgraph "Edge Layer - C++ Core"
        LB["⚡ Load Balancer<br/>DPDK Accelerated"]
        TLS["🔒 TLS Termination<br/>OpenSSL"]
        WAF["🛡️ Web Application Firewall"]
        RateLimit["⏱️ Rate Limiter"]
        CacheEngine["💾 Caching Engine<br/>io_uring + liburing<br/>In-Memory & Disk"]
        HTTPParse["📝 HTTP Parser<br/>llhttp"]
        Proxy["🔀 Reverse Proxy<br/>Request Routing<br/>Thread-per-Core<br/>Event-Driven"]
    end

    subgraph "Compression & Features"
        Compress["📦 Compression<br/>Brotli/Gzip"]
    end

    subgraph "Security & Access Control"
        Auth["🔐 Better Auth<br/>Deno Native<br/>JWT/OAuth2"]
        RBAC["👤 OpenFGA<br/>Fine-grained RBAC"]
    end

    subgraph "Backend Services - Deno/Hono"
        APIServer["🚀 Hono API Server<br/>Deno Runtime<br/>TypeScript/JS"]
        WorkerPool["⚙️ Workers<br/>Background Jobs"]
        RealtimeWS["📡 WebSocket Server<br/>Real-time Updates"]
    end

    subgraph "Frontend"
        React["⚛️ React App<br/>SPA Client"]
        State["📊 State Management<br/>Deno Native KV"]
    end

    subgraph "Data & Storage Layer"
        Redis["🔴 Redis<br/>Session Store<br/>Cache Layer<br/>Rate Limit State"]
        ElectricSQL["⚡ Electric SQL<br/>Real-time Sync<br/>Deno SQLite"]
        DB["🗄️ Primary Database<br/>PostgreSQL/SQLite"]
    end

    subgraph "Message Queue & Streaming"
        Kafka["📨 Apache Kafka<br/>Event Stream<br/>Backend/Frontend Sync"]
    end

    subgraph "Logging & Observability"
        Prometheus["📈 Prometheus<br/>Metrics Collection"]
        Grafana["📊 Grafana<br/>Visualization<br/>Dashboards"]
        ClickHouse["📉 ClickHouse<br/>Log Aggregation<br/>Analytics DB"]
        Collector["🔍 Log Collector<br/>Vector/Fluentd"]
    end

    subgraph "Infrastructure & Deployment"
        Docker["🐳 Docker<br/>Container Images<br/>Multi-stage builds"]
        K8s["☸️ Kubernetes<br/>Orchestration<br/>Auto-scaling<br/>Load Distribution"]
        Registry["📦 Container Registry<br/>Image Storage"]
    end

    Browser --> LB
    Mobile --> LB
    External --> LB
    
    LB --> TLS
    TLS --> WAF
    WAF --> RateLimit
    RateLimit --> CacheEngine
    
    CacheEngine -->|Cache Hit| Compress
    CacheEngine -->|Cache Miss| HTTPParse
    HTTPParse --> Proxy
    
    Proxy --> Auth
    Auth --> RBAC
    
    RBAC --> APIServer
    RBAC --> RealtimeWS
    
    APIServer --> Redis
    APIServer --> ElectricSQL
    APIServer --> DB
    APIServer --> WorkerPool
    
    RealtimeWS --> Kafka
    WorkerPool --> Kafka
    
    Kafka --> React
    Kafka --> APIServer
    
    React --> State
    State --> ElectricSQL
    
    APIServer --> Prometheus
    RealtimeWS --> Prometheus
    Proxy --> Prometheus
    ClickHouse --> Prometheus
    
    Collector --> ClickHouse
    APIServer --> Collector
    Proxy --> Collector
    
    Prometheus --> Grafana
    ClickHouse --> Grafana
    
    APIServer --> Docker
    React --> Docker
    
    Docker --> Registry
    Registry --> K8s
    
    K8s -.->|Deploys| Proxy
    K8s -.->|Deploys| APIServer
    K8s -.->|Deploys| RealtimeWS

    style LB fill:#ff6b6b
    style TLS fill:#ff6b6b
    style WAF fill:#ff6b6b
    style RateLimit fill:#ff6b6b
    style CacheEngine fill:#ff6b6b
    style HTTPParse fill:#ff6b6b
    style Proxy fill:#ff6b6b
    
    style Browser fill:#4ecdc4
    style React fill:#4ecdc4
    
    style APIServer fill:#45b7d1
    style RealtimeWS fill:#45b7d1
    
    style Redis fill:#f7b731
    style ElectricSQL fill:#f7b731
    style Kafka fill:#f7b731
    
    style Prometheus fill:#5f27cd
    style Grafana fill:#5f27cd
    style ClickHouse fill:#5f27cd
```

## Component Breakdown

### Edge Layer (C++ Core) - High Performance
- **io_uring + liburing** for async I/O
- **DPDK** acceleration for packet processing
- **Thread-per-core** with shared-nothing architecture
- **OpenSSL** for TLS termination
- **llhttp** for HTTP parsing
- **In-memory + disk cache** with cache-aside pattern

### Backend (Deno + Hono)
- **Deno runtime** for native TypeScript execution
- **Hono framework** for minimal, fast HTTP server
- **Native Deno KV** for state management
- **WebSocket server** for real-time features

### Security
- **Better Auth**: Deno-native authentication
- **OpenFGA**: Fine-grained RBAC and authorization
- **Rate limiting** at edge layer

### Data Layer
- **Redis**: Session store, cache, rate limit state
- **ElectricSQL**: Real-time sync between backend and frontend
- **SQLite/PostgreSQL**: Primary persistent storage

### Messaging
- **Apache Kafka**: Event streaming for async communication

### Observability
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **ClickHouse**: Time-series log storage and analytics

### Infrastructure
- **Docker**: Container images with multi-stage builds
- **Kubernetes**: Orchestration, scaling, distribution
