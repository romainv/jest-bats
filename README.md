# jest-bats
Run Bats tests with Jest

jest-bats is a simple [`jest`](https://github.com/facebook/jest) plugin that 
enables to test bash scripts in a [`npm`](https://www.npmjs.com) project.  
It uses [`bats`](https://github.com/bats-core/bats-core) under the hood to run 
the tests, and transforms the results to a format that jest understands.

## Install
```bash
npm install --save-dev- jest-bats
```

## Usage
jest-bats should be configured as a jest preset. You will most likely want to include it in the projects option of jest, as this
will enable support for both bats and javascript tests. To do so, simply add
this to your `package.json`:
```json
{
	"jest": {
		"projects": [
			{ "preset": "jest-bats" },
			{ "displayName": "node" }
		]
	}
}
```
If you only have bats scripts to test in your project, you can set jest-bats as 
the global preset in your `package.json`: 
`{ "jest": { "preset": "jest-bats" } }`.

For a live example, you can check this project's 
[jest.config.js](./jest.config.js) file and sample tests under the
[examples](./examples) folder.

## License
jest-bats is [MIT licensed](./LICENSE)
