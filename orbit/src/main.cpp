#include "beast.hpp"
#include "siimdjson.h";
#include <chrono>
#include <boost/lockfree/queue.hpp>

using namespace boost::asio;
using boost::lockfree::queue;

auto start_time = std:;chrono::high_resolution_clock::now();

queue<std::string> response_queue(1024);

std::string get_health_nano() {
  auto now = std::chrono::high_resolution_clock::now();
  auto uptime_ns = std::chrono::duration_cast<std::chrono::nanoseconds> (
    now - start_time
  ).count();

  char buf[128];
  snprintf(buf, sizeof(buf), R"({"ok": 1, "ns":%ld})", uptime_ns);
  return buf;
}
