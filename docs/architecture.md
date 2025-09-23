# Architecture / 架构

## Layer Overview / 分层
- core: blockchain init, config, security
- modules: contract assembly, template handling, history
- utils: hashing, validation helpers
- ui: page scripts (lazy loaded)
- models: data shape definitions

## Data Flow / 数据流
User Input -> Validation -> Template Merge -> Hash -> (Optional Web3 Sign/Store) -> History Persist

## State Storage / 状态存储
- Local (browser localStorage / future IndexedDB)
- Optional: On-chain hash reference
- Future: IPFS (content addressable)

## Error Handling / 错误处理
- Synchronous validation throws Error
- UI catches + displays user-friendly message
- Future: central error bus

## Security Touchpoints
- sanitize.js (DOMPurify)
- validation.js (field schema)
- hash-utils.js (immutable integrity check)
