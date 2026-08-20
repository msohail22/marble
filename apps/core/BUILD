load("@rules_cc//cc:defs.bzl", "cc_binary", "cc_test")

cc_binary(
    name = "marble-core",
    srcs = ["src/main.cpp"],
    includes = ["include"],
)

cc_test(
    name = "core_test",
    srcs = ["tests/core_test.cpp"],
    deps = ["@com_google_googletest//:gtest_main"],
)
