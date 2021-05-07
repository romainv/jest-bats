module.exports = {
  displayName: "bats",
  testMatch: [`**/?(*.)+(bats)`],
  runner: require.resolve("./src/runner"),
  // Add custom extensions, otherwise they are ignored despite testMatch
  moduleFileExtensions: ["bats"],
}
