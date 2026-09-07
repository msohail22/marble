add_executable(orbit_simple_test simple_test.cpp)

target_link_libraries(orbit_simple_test PRIVATE GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(orbit_simple_test)
