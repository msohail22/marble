cmake_minimum_required(VERSION 3.20)

project(orbit)

include(CTest)

include(FetchContent)

FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.17.0
)

FetchContent_MakeAvailable(googletest)

add_executable(orbit src/main.cpp)

target_link_libraries(orbit PRIVATE GTest::gtest)

if(BUILD_TESTING)
    add_subdirectory(tests)
endif()
