# ☸️ Marble: Complete Kubernetes, Docker & ArgoCD Implementation Plan

This document serves as the **exhaustive, production-ready implementation spec** for containerizing, deploying, and managing the **Marble** monorepo stack locally using Kubernetes and Argo CD. It contains complete, unabridged, copy-paste-ready implementation code for all Dockerfiles, Nginx configs, Kubernetes manifests, and Argo CD GitOps definitions.

---

## 📁 Repository Directory Blueprint

```
marble/
├── apps/
│   ├── api/
│   │   └── Dockerfile                 # [FILE 1] Backend Deno Containerfile
│   └── web/
│       ├── Dockerfile                 # [FILE 2] Frontend Multi-Stage Build
│       └── nginx.conf                 # [FILE 3] Production SPA & API Proxy Nginx Config
├── k8s/
│   ├── namespace.yaml                 # [FILE 4] Namespace definition
│   ├── cockroachdb/
│   │   ├── statefulset.yaml           # [FILE 5] Single/Multi-node CockroachDB StatefulSet
│   │   └── service.yaml               # [FILE 6] CockroachDB Internal Cluster Service
│   ├── backend/
│   │   ├── deployment.yaml            # [FILE 7] API Deployment (Hono + Deno)
│   │   └── service.yaml               # [FILE 8] API Internal Service
│   ├── frontend/
│   │   ├── deployment.yaml            # [FILE 9] Web Deployment (Nginx SPA)
│   │   └── service.yaml               # [FILE 10] Web NodePort/Ingress Service
│   └── argocd-app.yaml                # [FILE 11] Argo CD GitOps Application Manifest
├── .dockerignore                      # [FILE 12] Root Docker Build Context Filter
└── K8S_ARGOCD_PLAN.md                 # THIS SPECIFICATION DOCUMENT
```

---

## ⚙️ Complete Implementation Files

### [FILE 1] `apps/api/Dockerfile`
```dockerfile
# File: apps/api/Dockerfile
# Base image with Deno 1.40 runtime on Alpine Linux
FROM denoland/deno:alpine-1.40.0 AS base

WORKDIR /app

# Copy monorepo configuration files for module resolution
COPY deno.json deno.lock ./
COPY packages/packages/
COPY apps/api/ apps/api/

WORKDIR /app/apps/api

# Pre-cache Deno dependencies for faster runtime startup
RUN deno cache src/index.ts

# Expose internal API HTTP server port
EXPOSE 3000

ENV PORT=3000
ENV DENO_ENV=production

# Start Hono server
CMD ["deno", "run", "--allow-net", "--allow-env", "src/index.ts"]
```

---

### [FILE 2] `apps/web/Dockerfile`
```dockerfile
# File: apps/web/Dockerfile

# --- Stage 1: Build static React SPA assets ---
FROM denoland/deno:alpine-1.40.0 AS builder

WORKDIR /app

# Copy root dependencies and packages required for types & build
COPY deno.json deno.lock ./
COPY packages/ packages/
COPY apps/web/ apps/web/

WORKDIR /app/apps/web

# Execute Vite production build
RUN deno task build

# --- Stage 2: Production Nginx Server ---
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

### [FILE 3] `apps/web/nginx.conf`
```nginx
# File: apps/web/nginx.conf
server {
    listen 80;
    server_name localhost;

    # Serve React SPA static files
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests directly to the Kubernetes API ClusterIP Service
    location /api/ {
        proxy_pass http://marble-api-service.marble.svc.cluster.local:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check for Nginx web container
    location /healthz {
        access_log off;
        return 200 'OK';
    }
}
```

---

### [FILE 4] `.dockerignore`
```ignore
# File: .dockerignore
.git
.github
.vscode
.idea
node_modules
dist
bazel-*
*.log
.env*
.DS_Store
```

---

### [FILE 5] `k8s/namespace.yaml`
```yaml
# File: k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: marble
  labels:
    name: marble
    environment: local
```

---

### [FILE 6] `k8s/cockroachdb/statefulset.yaml`
```yaml
# File: k8s/cockroachdb/statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: cockroachdb
  namespace: marble
  labels:
    app.kubernetes.io/name: cockroachdb
    app.kubernetes.io/part-of: marble
spec:
  serviceName: cockroachdb-service
  replicas: 1
  selector:
    matchLabels:
      app: cockroachdb
  template:
    metadata:
      labels:
        app: cockroachdb
    spec:
      containers:
      - name: cockroachdb
        image: cockroachdb/cockroach:v23.2.3
        imagePullPolicy: IfNotPresent
        args:
        - start-single-node
        - --insecure
        - --http-addr=0.0.0.0:8080
        - --listen-addr=0.0.0.0:26257
        ports:
        - containerPort: 26257
          name: grpc
        - containerPort: 8080
          name: http
        env:
        - name: COCKROACH_DATABASE
          value: marble_db
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "250m"
            memory: "512Mi"
```

---

### [FILE 7] `k8s/cockroachdb/service.yaml`
```yaml
# File: k8s/cockroachdb/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: cockroachdb-service
  namespace: marble
  labels:
    app.kubernetes.io/name: cockroachdb
spec:
  type: ClusterIP
  ports:
  - port: 26257
    targetPort: 26257
    name: grpc
  - port: 8080
    targetPort: 8080
    name: http
  selector:
    app: cockroachdb
```

---

### [FILE 8] `k8s/backend/deployment.yaml`
```yaml
# File: k8s/backend/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: marble-api
  namespace: marble
  labels:
    app.kubernetes.io/name: marble-api
    app.kubernetes.io/part-of: marble
spec:
  replicas: 2
  selector:
    matchLabels:
      app: marble-api
  template:
    metadata:
      labels:
        app: marble-api
    spec:
      containers:
      - name: api
        image: marble-api:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          value: "postgresql://root@cockroachdb-service.marble.svc.cluster.local:26257/marble_db?sslmode=disable"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
```

---

### [FILE 9] `k8s/backend/service.yaml`
```yaml
# File: k8s/backend/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: marble-api-service
  namespace: marble
  labels:
    app.kubernetes.io/name: marble-api
spec:
  type: ClusterIP
  ports:
  - port: 3000
    targetPort: 3000
    name: http
  selector:
    app: marble-api
```

---

### [FILE 10] `k8s/frontend/deployment.yaml`
```yaml
# File: k8s/frontend/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: marble-web
  namespace: marble
  labels:
    app.kubernetes.io/name: marble-web
    app.kubernetes.io/part-of: marble
spec:
  replicas: 2
  selector:
    matchLabels:
      app: marble-web
  template:
    metadata:
      labels:
        app: marble-web
    spec:
      containers:
      - name: web
        image: marble-web:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
          name: http
        livenessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 5
        resources:
          limits:
            cpu: "300m"
            memory: "256Mi"
          requests:
            cpu: "50m"
            memory: "64Mi"
```

---

### [FILE 11] `k8s/frontend/service.yaml`
```yaml
# File: k8s/frontend/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: marble-web-service
  namespace: marble
  labels:
    app.kubernetes.io/name: marble-web
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
    name: http
  selector:
    app: marble-web
```

---

### [FILE 12] `k8s/argocd-app.yaml`
```yaml
# File: k8s/argocd-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: marble-stack
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: 'https://github.com/<YOUR_GITHUB_USER>/marble.git'
    targetRevision: HEAD
    path: k8s
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: marble
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

---

## 🚀 Step-by-Step Execution Command Scripts

Follow these explicit commands in order to bring up the full stack locally:

### Step 1: Create Files in Monorepo
Run shell directory creation:
```bash
mkdir -p k8s/cockroachdb k8s/backend k8s/frontend
```
Write each of the files above into their respective paths (`apps/api/Dockerfile`, `apps/web/Dockerfile`, `apps/web/nginx.conf`, `.dockerignore`, and all `k8s/` manifests).

---

### Step 2: Spin Up Local Kubernetes Cluster

#### Option A: Kind Cluster (Recommended)
```bash
# Create cluster named marble-cluster
kind create cluster --name marble-cluster

# Verify cluster connection via kubectl
kubectl cluster-info --context kind-marble-cluster
```

#### Option B: Minikube Cluster
```bash
# Start minikube with Docker driver
minikube start --driver=docker

# Verify cluster status via kubectl
kubectl cluster-info
```

---

### Step 3: Build & Load Docker Images

Build both Docker images from workspace root and load them into the local cluster daemon:

```bash
# 1. Build images
docker build -t marble-api:latest -f apps/api/Dockerfile .
docker build -t marble-web:latest -f apps/web/Dockerfile .

# 2. Load into Kind
kind load docker-image marble-api:latest --name marble-cluster
kind load docker-image marble-web:latest --name marble-cluster

# OR load into Minikube
# minikube image load marble-api:latest
# minikube image load marble-web:latest
```

---

### Step 4: Install Argo CD & Retrieve Admin Password

```bash
# 1. Create argocd namespace
kubectl create namespace argocd

# 2. Install official Argo CD manifests
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Wait for Argo CD pods to become Ready
kubectl get pods -n argocd -w

# 4. Extract Argo CD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

---

### Step 5: Access Argo CD UI & Deploy Application

```bash
# 1. Forward Argo CD Server port to localhost:8080
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
- Open your web browser to: **`https://localhost:8080`**
- Log in with:
  - **Username**: `admin`
  - **Password**: *(The password output from Step 4)*

#### Option A: Deploy via `kubectl` directly (Direct Manifest Sync)
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/cockroachdb/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

#### Option B: Register GitOps Application into Argo CD
Update `repoURL` in `k8s/argocd-app.yaml` with your actual repository URL, then run:
```bash
kubectl apply -f k8s/argocd-app.yaml
```

---

### Step 6: Verify Deployment & Access Apps

```bash
# Check all resources in marble namespace
kubectl get all -n marble

# Port-forward web frontend (if not using NodePort 30080)
kubectl port-forward svc/marble-web-service -n marble 8081:80

# Port-forward API backend
kubectl port-forward svc/marble-api-service -n marble 3000:3000

# Test backend health check
curl http://localhost:3000/health
```

Now access the Frontend React Dashboard at `http://localhost:8081` or `http://localhost:30080`!

---

## 🔍 Validation Checklist for Agents & Developers

- [x] Docker build context configured at workspace root to preserve `@marble/types` package sharing.
- [x] React SPA fallback routing (`try_files $uri $uri/ /index.html;`) in Nginx config.
- [x] Reverse proxy `/api/` path mapping to `http://marble-api-service.marble.svc.cluster.local:3000/`.
- [x] Readiness and Liveness probes defined for Kubernetes deployments.
- [x] Argo CD `Application` custom resource formatted for GitOps workflow.
