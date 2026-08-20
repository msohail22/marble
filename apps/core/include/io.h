#pragma once

// io_uring + async I/O stub
class IOUring {
 public:
  void init();
  void submit_request();
};
