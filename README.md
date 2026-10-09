# bare-wasm

WebAssembly JavaScript API for Bare. Import the WebAssembly APIs you need from here rather than from the `WebAssembly` global, which may or may not be available.

```
npm i bare-wasm
```

## Usage

```js
const { Module, Instance } = require('bare-wasm')

const module = new Module(bytes)
const instance = new Instance(module, imports)
```

## API

The exports mirror the `WebAssembly` namespace of the WebAssembly JavaScript API:

- `Module`, `Instance`, `Memory`, `Table`, `Global`, `Tag`, and `Exception`
- `CompileError`, `LinkError`, and `RuntimeError`
- `validate()`, `compile()`, and `instantiate()`

## License

Apache-2.0
