class Module {
  constructor() {
    throw UNAVAILABLE()
  }

  static exports() {
    throw UNAVAILABLE()
  }

  static imports() {
    throw UNAVAILABLE()
  }

  static customSections() {
    throw UNAVAILABLE()
  }
}

class Instance {
  constructor() {
    throw UNAVAILABLE()
  }
}

class Memory {
  constructor() {
    throw UNAVAILABLE()
  }
}

class Table {
  constructor() {
    throw UNAVAILABLE()
  }
}

class Global {
  constructor() {
    throw UNAVAILABLE()
  }
}

class Tag {
  constructor() {
    throw UNAVAILABLE()
  }
}

class Exception {
  constructor() {
    throw UNAVAILABLE()
  }
}

class CompileError extends Error {
  get name() {
    return 'CompileError'
  }
}

class LinkError extends Error {
  get name() {
    return 'LinkError'
  }
}

class RuntimeError extends Error {
  get name() {
    return 'RuntimeError'
  }
}

exports.Module = Module
exports.Instance = Instance
exports.Memory = Memory
exports.Table = Table
exports.Global = Global
exports.Tag = Tag
exports.Exception = Exception

exports.CompileError = CompileError
exports.LinkError = LinkError
exports.RuntimeError = RuntimeError

exports.validate = function validate() {
  throw UNAVAILABLE()
}

exports.compile = function compile() {
  return Promise.reject(UNAVAILABLE())
}

exports.instantiate = function instantiate() {
  return Promise.reject(UNAVAILABLE())
}

function UNAVAILABLE() {
  const err = new Error('WebAssembly is not available')
  err.code = 'WEBASSEMBLY_UNAVAILABLE'
  return err
}
