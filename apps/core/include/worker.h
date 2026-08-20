#pragma once

// Worker pool + thread management stub
class Worker {
 public:
  void init_pool(int num_threads);
  void submit_task();
};
