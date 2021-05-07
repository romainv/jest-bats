const runner = require("./runner")

describe("runner", () => {
  test("exports a function", () => {
    expect(typeof runner).toBe("function")
  })
})
