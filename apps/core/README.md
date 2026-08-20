# Marble C++ Core

High-performance reverse proxy & caching engine.

## Building

```bash
bazel build //apps/core:marble-core
```

## Running

```bash
bazel run //apps/core:marble-core
```

## Testing

```bash
bazel test //apps/core:core_test
```

## Structure

- `src/` - Implementation files
- `include/` - Header files
- `tests/` - Unit tests
- `BUILD` - Bazel build configuration

## Features

- **io_uring** - Async I/O via liburing
- **Thread-per-core** - Shared-nothing architecture
- **OpenSSL** - TLS termination
- **llhttp** - HTTP parsing
- **In-memory cache** - Request caching
- **Event-driven** - Async request pipeline
