/** The WebAssembly JavaScript API, mirroring the `WebAssembly` namespace. */
declare namespace wasm {
  /** The bytes of a WebAssembly module in its binary format. */
  type BufferSource = ArrayBuffer | ArrayBufferView

  /** The type of a WebAssembly value. */
  type ValueType = 'i32' | 'i64' | 'f32' | 'f64' | 'v128' | 'externref' | 'anyfunc'

  /** The type of the elements of a table. */
  type TableKind = 'externref' | 'anyfunc'

  /** The kind of an import or export of a module. */
  type ImportExportKind = 'function' | 'table' | 'memory' | 'global' | 'tag'

  /** A value exported by an instance. */
  type ExportValue = Function | Global | Memory | Table | Tag

  /** The exports of an instance, keyed by name. */
  type Exports = Record<string, ExportValue>

  /** A value that may be provided to satisfy an import. */
  type ImportValue = ExportValue | number | bigint

  /** The imports of a single import module, keyed by name. */
  type ModuleImports = Record<string, ImportValue>

  /** The imports of a module, keyed by import module name. */
  type Imports = Record<string, ModuleImports>

  interface ModuleExportDescriptor {
    /** The name of the export. */
    name: string
    /** The kind of the export. */
    kind: ImportExportKind
  }

  interface ModuleImportDescriptor {
    /** The name of the module the import is resolved from. */
    module: string
    /** The name of the import. */
    name: string
    /** The kind of the import. */
    kind: ImportExportKind
  }

  /** A stateless WebAssembly module that has been compiled. */
  class Module {
    /**
     * Synchronously compile a module.
     * @param bytes - The binary format of the module.
     * @throws {CompileError} thrown if `bytes` is not a valid module.
     */
    constructor(bytes: BufferSource)

    /** Get descriptors of the exports of `module`. */
    static exports(module: Module): ModuleExportDescriptor[]

    /** Get descriptors of the imports of `module`. */
    static imports(module: Module): ModuleImportDescriptor[]

    /** Get the contents of the custom sections of `module` named `sectionName`. */
    static customSections(module: Module, sectionName: string): ArrayBuffer[]
  }

  /** A stateful, executable instance of a module. */
  class Instance {
    /**
     * Synchronously instantiate a module.
     * @param module - The module to instantiate.
     * @param imports - The values to satisfy the imports of the module with.
     * @throws {LinkError} thrown if the imports of the module cannot be satisfied.
     * @throws {RuntimeError} thrown if the start function of the module traps.
     */
    constructor(module: Module, imports?: Imports)

    /** The exports of the instance. */
    readonly exports: Exports
  }

  interface MemoryDescriptor {
    /** The initial size of the memory in pages of 64 KiB. */
    initial: number
    /** The maximum size of the memory in pages of 64 KiB. */
    maximum?: number
    /** Whether the memory may be shared between agents. */
    shared?: boolean
  }

  /** A resizable linear memory. */
  class Memory {
    constructor(descriptor: MemoryDescriptor)

    /** The buffer backing the memory, which is detached and replaced whenever it grows. */
    readonly buffer: ArrayBuffer | SharedArrayBuffer

    /**
     * Grow the memory.
     * @param delta - The number of pages of 64 KiB to grow the memory by.
     * @returns The previous size of the memory in pages.
     * @throws {RangeError} thrown if the memory cannot grow by `delta` pages.
     */
    grow(delta: number): number
  }

  interface TableDescriptor {
    /** The type of the elements of the table. */
    element: TableKind
    /** The initial number of elements of the table. */
    initial: number
    /** The maximum number of elements of the table. */
    maximum?: number
  }

  /** A resizable array of references. */
  class Table {
    /**
     * @param descriptor - The type and limits of the table.
     * @param value - The value to initialize the elements of the table with.
     */
    constructor(descriptor: TableDescriptor, value?: any)

    /** The number of elements of the table. */
    readonly length: number

    /** Get the element at `index`. */
    get(index: number): any

    /** Set the element at `index` to `value`. */
    set(index: number, value?: any): void

    /**
     * Grow the table.
     * @param delta - The number of elements to grow the table by.
     * @param value - The value to initialize the new elements with.
     * @returns The previous number of elements of the table.
     * @throws {RangeError} thrown if the table cannot grow by `delta` elements.
     */
    grow(delta: number, value?: any): number
  }

  interface GlobalDescriptor {
    /** The type of the value of the global. */
    value: ValueType
    /** Whether the value of the global may be changed. */
    mutable?: boolean
  }

  /** A global variable that may be shared between instances. */
  class Global<T = any> {
    /**
     * @param descriptor - The type and mutability of the global.
     * @param value - The initial value of the global.
     */
    constructor(descriptor: GlobalDescriptor, value?: T)

    /** The value of the global. */
    value: T

    /** Get the value of the global. */
    valueOf(): T
  }

  interface TagType {
    /** The types of the values carried by exceptions with the tag. */
    parameters: ValueType[]
  }

  /** A tag identifying a type of exception. */
  class Tag {
    constructor(type: TagType)
  }

  interface ExceptionOptions {
    /** Whether to capture a stack trace in the `stack` property of the exception. */
    traceStack?: boolean
  }

  /** An exception that may be thrown across WebAssembly and JavaScript. */
  class Exception {
    /**
     * @param tag - The tag identifying the type of the exception.
     * @param payload - The values carried by the exception, matching the parameters of `tag`.
     * @param options - Options for the exception.
     */
    constructor(tag: Tag, payload: any[], options?: ExceptionOptions)

    /** The stack trace of the exception, if requested with `traceStack`. */
    readonly stack?: string

    /**
     * Get a value carried by the exception.
     * @param tag - The tag the exception must have.
     * @param index - The index of the value in the payload.
     * @throws {TypeError} thrown if the exception does not have `tag`.
     */
    getArg(tag: Tag, index: number): any

    /** Check whether the exception has `tag`. */
    is(tag: Tag): boolean
  }

  /** An error thrown when a module fails to decode or validate. */
  class CompileError extends Error {}

  /** An error thrown when the imports of a module cannot be satisfied. */
  class LinkError extends Error {}

  /** An error thrown when WebAssembly code traps. */
  class RuntimeError extends Error {}

  interface InstantiatedSource {
    /** The module that was compiled. */
    module: Module
    /** The instance of the module. */
    instance: Instance
  }

  /** Check whether `bytes` is a valid module. */
  function validate(bytes: BufferSource): boolean

  /**
   * Asynchronously compile a module.
   * @param bytes - The binary format of the module.
   */
  function compile(bytes: BufferSource): Promise<Module>

  /**
   * Asynchronously compile and instantiate a module.
   * @param bytes - The binary format of the module.
   * @param imports - The values to satisfy the imports of the module with.
   */
  function instantiate(bytes: BufferSource, imports?: Imports): Promise<InstantiatedSource>

  /**
   * Asynchronously instantiate a compiled module.
   * @param module - The module to instantiate.
   * @param imports - The values to satisfy the imports of the module with.
   */
  function instantiate(module: Module, imports?: Imports): Promise<Instance>
}

export = wasm
