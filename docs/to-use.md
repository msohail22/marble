Understood — Docker only for frontend + Postgres, backend runs bare-metal so nothing masks real performance characteristics. Here's the full topic list, grouped so it's easier to sequence later:

**Networking / I/O**
- epoll
- io_uring
- kernel bypass networking (DPDK)
- AF_XDP
- zero-copy I/O
- TCP tuning (TCP_NODELAY, SO_REUSEPORT, SO_BUSY_POLL)
- edge-triggered vs level-triggered I/O
- busy-polling vs blocking I/O

**Concurrency / Threading**
- thread-per-core architecture
- CPU affinity / thread pinning
- lock-free programming
- atomics and memory ordering (acquire/release/seq_cst)
- spinlocks
- SPSC / MPSC / MPMC ring buffers
- false sharing
- C++20 coroutines
- work-stealing schedulers

**Memory**
- NUMA awareness
- huge pages
- custom allocators (arena/slab/pool allocators)
- cache-line alignment
- cache hierarchy (L1/L2/L3) and cache-friendly layouts
- prefetching

**CPU / Hardware**
- SIMD (SSE/AVX/AVX-512)
- branchless programming
- branch prediction
- instruction pipelining
- rdtsc / cycle-accurate timing

**Data structures**
- lock-free queues
- intrusive containers
- open-addressing hash maps
- flat/contiguous containers over pointer-chasing structures
- object pooling

**Serialization / Parsing**
- zero-copy parsing
- simdjson
- custom binary wire protocols
- FlatBuffers / Cap'n Proto style zero-copy serialization

**Database / Persistence layer**
- connection pooling
- prepared statements
- async DB drivers (libpqxx async, or raw libpq)
- batched writes
- WAL / durability tradeoffs

**Observability**
- lock-free metrics collection
- perf / flame graphs
- tail latency measurement (p99/p999, not just averages)
- low-overhead tracing

**Build / Tooling**
- CMake / Bazel
- compiler optimization flags (-O3, LTO, PGO)
- Google Benchmark
- perf, VTune, or similar profilers

That's the full menu — next step would be to pick an order (I'd suggest starting with epoll + thread-per-core + the request context plumbing, since everything else layers on top of that), unless you want to lock the order in now.
