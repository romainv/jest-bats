const run = require("./run")

describe("run", () => {
  test("doesn't fail", async () => {
    const options = { testPath: "./" } // Dummy options with required attributes
    await expect(run(options)).resolves.toEqual(
      expect.objectContaining({
        // Expect the perfStats attribute to be populated
        perfStats: {
          start: expect.any(Number),
          end: expect.any(Number),
        },
      })
    )
  })
})
