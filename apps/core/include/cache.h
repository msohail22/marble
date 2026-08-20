#pragma once

// Cache engine stub
class Cache {
 public:
  void put(const char* key, const char* value);
  const char* get(const char* key);
};
