cmake_minimum_required(VERSION 3.20)

# Prefer Clang for fresh build trees and reject any non-Clang configuration.
# CMake selects compilers on its first configure, so an existing build tree
# configured with another compiler must be recreated.
if(NOT DEFINED CMAKE_C_COMPILER)
    set(CMAKE_C_COMPILER clang CACHE FILEPATH "C compiler")
endif()
if(NOT DEFINED CMAKE_CXX_COMPILER)
    set(CMAKE_CXX_COMPILER clang++ CACHE FILEPATH "C++ compiler")
endif()

project(orbit LANGUAGES C CXX)

if(NOT CMAKE_C_COMPILER_ID STREQUAL "Clang" OR
   NOT CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
    message(FATAL_ERROR
        "Orbit requires Clang for C and C++. Configure a fresh build tree with "
        "-DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++.")
endif()

# yaml-cpp 0.8.0 supports this policy baseline, but declares an older
# cmake_minimum_required version that CMake 4 no longer accepts by default.
set(CMAKE_POLICY_VERSION_MINIMUM 3.5 CACHE STRING "" FORCE)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(CTest)
include(FetchContent)

# libpq is supplied by the PostgreSQL development package on the host.
find_package(PostgreSQL REQUIRED)

# The cache and networking layers are implemented in orbit itself: no Redis,
# Asio, or other external dependency is needed for POSIX sockets and epoll.
FetchContent_Declare(
    simdjson
    GIT_REPOSITORY https://github.com/simdjson/simdjson.git
    GIT_TAG v3.13.0
    GIT_SHALLOW TRUE
)
FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG v1.15.3
    GIT_SHALLOW TRUE
)
FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG 11.2.0
    GIT_SHALLOW TRUE
)
FetchContent_Declare(
    yaml_cpp
    GIT_REPOSITORY https://github.com/jbeder/yaml-cpp.git
    GIT_TAG 0.8.0
    GIT_SHALLOW TRUE
)
FetchContent_Declare(
    prometheus_cpp
    GIT_REPOSITORY https://github.com/jupp0r/prometheus-cpp.git
    GIT_TAG v1.3.0
    GIT_SHALLOW TRUE
)
FetchContent_Declare(
    benchmark
    GIT_REPOSITORY https://github.com/google/benchmark.git
    GIT_TAG v1.9.4
    GIT_SHALLOW TRUE
)
FetchContent_Declare(
    llhttp
    GIT_REPOSITORY https://github.com/nodejs/llhttp.git
    GIT_TAG release/v9.2.1
    GIT_SHALLOW TRUE
)

# Disable optional upstream tests and installation targets in this build.
set(SPDLOG_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(FMT_TEST OFF CACHE BOOL "" FORCE)
set(YAML_CPP_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(ENABLE_TESTING OFF CACHE BOOL "" FORCE)
set(BENCHMARK_ENABLE_TESTING OFF CACHE BOOL "" FORCE)
set(BENCHMARK_ENABLE_WERROR OFF CACHE BOOL "" FORCE)
set(BUILD_STATIC_LIBS ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(
    simdjson
    spdlog
    fmt
    yaml_cpp
    prometheus_cpp
    benchmark
    llhttp
)

# yaml-cpp 0.8.0 omits <cstdint> in emitterutils.cpp.  Force the standard
# header only for Clang builds until an upstream release includes it.
target_compile_options(yaml-cpp PRIVATE
    "SHELL:-include cstdint"
)
# Google Benchmark 1.9.4 uses __COUNTER__ in a preprocessor expression;
# Clang 22 diagnoses it as a C2y extension under Benchmark's pedantic flags.
target_compile_options(benchmark PRIVATE -Wno-c2y-extensions)
target_compile_options(benchmark_main PRIVATE -Wno-c2y-extensions)

add_library(orbit_dependencies INTERFACE)
target_link_libraries(orbit_dependencies INTERFACE
    PostgreSQL::PostgreSQL
    simdjson
    spdlog::spdlog
    fmt::fmt
    yaml-cpp::yaml-cpp
    prometheus-cpp::core
    benchmark::benchmark
    llhttp::llhttp
)

add_executable(orbit src/main.cpp)
target_link_libraries(orbit PRIVATE orbit_dependencies)

if(BUILD_TESTING)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG v1.17.0
        GIT_SHALLOW TRUE
    )
    FetchContent_MakeAvailable(googletest)

    add_subdirectory(tests)
endif()
