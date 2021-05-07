module.exports = {
  projects: [
    // NOTE: We import the preset locally, but you would normally set it as:
    // { preset: "jest-bats" } when using the npm module
    { preset: "./jest-preset" },
    // We enable testing js files as well, as using jest-bats as a global
    // preset would restrict tests to only bats files
    { displayName: "node" },
  ],
}
