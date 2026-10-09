const test = require('brittle')
const wasm = require('.')

// (module (func (export "add") (param i32 i32) (result i32) local.get 0 local.get 1 i32.add))
const bytes = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01,
  0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09,
  0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b
])

test('reexports the global WebAssembly objects', (t) => {
  for (const name of [
    'Module',
    'Instance',
    'Memory',
    'Table',
    'Global',
    'Tag',
    'Exception',
    'CompileError',
    'LinkError',
    'RuntimeError',
    'validate',
    'compile',
    'instantiate'
  ]) {
    t.is(wasm[name], WebAssembly[name], name)
  }
})

test('validate', (t) => {
  t.ok(wasm.validate(bytes))
  t.absent(wasm.validate(new Uint8Array([0x00])))
})

test('synchronous instantiation', (t) => {
  const module = new wasm.Module(bytes)
  const instance = new wasm.Instance(module)

  t.is(instance.exports.add(2, 40), 42)
})

test('asynchronous instantiation', async (t) => {
  const { instance } = await wasm.instantiate(bytes)

  t.is(instance.exports.add(2, 40), 42)
})

test('compile error', (t) => {
  t.exception(() => new wasm.Module(new Uint8Array([0x00])), wasm.CompileError)
})
