const { spawn } = require("child_process")
// We need toTestResult, which is an internal function of create-jest-runner
// that is not exposed directly by the module
const {
  default: toTestResult,
} = require("create-jest-runner/build/toTestResult")
const Parser = require("tap-parser")

/**
 * This function is called in parallel by the custom jest-bats runner for each
 * test file. It executes the tests defined in the supplied bats file, using
 * bats-core, parses bats-core's output (which is TAP-compliant) and returns
 * a jest-compliant object
 * @param {Object} options The options expected by create-jest-runner
 * @param {String} options.testPath Path to the file containing the tests to run
 * @param {Object} [options.config] Jest project config used by this file
 * @param {Object} [options.globalConfig] Jest global config
 * @param {Object} [options.extraOptions] The return value of the {
 * getExtraOptions} argument of createJestRunner()
 * @return {TestResult} A jest-compliant object with the test results
 */
module.exports = ({ testPath }) => {
  const start = Date.now() // Record when the test started
  const parser = new Parser()
  // Run the tests and pipe the command output to our parser
  const bats = spawn(require.resolve("bats/bin/bats"), ["-t", testPath])
  // Setting parser as stdio parameter of spawn doesn't work, so we pipe it as:
  bats.stdout.pipe(parser)
  return promisify(parser, start, testPath)
}

/**
 * Configures a parser so that it can be resolved as a promise
 * This function will executed recursively for each child parser created
 * @param {Object} parser The parser object to configure
 * @param {Int} start The time at which the test started
 * @param {String} testPath path to the file containing the tests to run
 * @return {Promise} A promise that will resolve with the parser's output
 */
function promisify(parser, start, testPath) {
  return new Promise((res) => {
    const tests = [] // Will contain test objects used by create-jest-runner
    parser.on("assert", (assert) =>
      // Append each assert into the list of tests in a compatible format
      tests.push(processAssert(assert, start, testPath))
    )
    parser.on("comment", (comment) => console.log(comment))
    parser.on("complete", (results) =>
      // Resolve promise with a compatible test result object
      res(processResults(results, tests, start, testPath))
    )
    parser.on("child", (childParser) =>
      // Recursively resolve the childParser created by create-jest-runner
      res(promisify(childParser, start, testPath))
    )
  })
}

/**
 * Converts the output of an 'assert' event from tap-parser into an
 * object to be used by create-jest-runner
 * @param {Object} assert The assert object provided by tap-parser
 * @param {Int} start The time at which the test started
 * @param {String} path Path to the file containing the tests to run
 * @return {Object} An object with keys: duration, errorMessage, title, path
 */
function processAssert({ skip, todo, ok, name: title }, start, path) {
  const duration = Date.now() - start // Calculate test duration
  if (skip) {
    return { duration, title, path }
  } else if (todo) {
    return { duration, title, path }
  } else if (ok) {
    return { duration, title, path }
  } else {
    return { duration, title, path, errorMessage: "ERROR" } // TODO: Error msg
  }
}

/**
 * Converts the final results object from tap-parser into a jest-compatible
 * object
 * @param {Object} results The object returned by tap-parser on completion
 * @param {Array} tests The list of test objects from each assert
 * @param {Int} start The time at which the test started
 * @param {String} jestTestPath path to the file containing the tests to run
 * @return {TestResult} A jest-compliant object with test results
 */
function processResults(
  {
    // Align names between create-jest-runner and tap-parser
    pass: passes,
    fail: failures,
    todo,
    skip: skipped,
    // TODO: failures: failuresList,
  },
  tests,
  start,
  jestTestPath
) {
  return toTestResult({
    stats: {
      failures,
      pending: 0,
      passes,
      todo,
      start,
      end: Date.now(), // Record when test finished
    },
    skipped,
    tests,
    jestTestPath,
  })
}
