cc_binary(
    name = "marble-core",
    srcs = ["src/main.cpp"],
    hdrs = ["include/*.h"],
    includes = ["include"],
    deps = [],
)

cc_test(
    name = "core_test",
    srcs = ["tests/core_test.cpp"],
    deps = ["@com_google_googletest//:gtest_main"],
)
