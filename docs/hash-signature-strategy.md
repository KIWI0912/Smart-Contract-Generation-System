# Hash & Signature Strategy

## Goals
- Integrity: detect tampering of generated contract text.
- Provenance: optional on-chain reference.

## Hash Algorithm
- Primary: SHA-256 (crypto-js)
- Input: canonical JSON of { templateId, version, fields, clauses, timestamp }
- Exclude dynamic UI state.

## Procedure
1. Build payload object
2. JSON.stringify with sorted keys
3. hash = SHA256(canonicalString)

## Signature (Planned)
- EIP-712 structured message:
  type ContractRecord {
    string templateId;
    string version;
    string hash;
    uint256 timestamp;
  }
- User signs via provider (eth_signTypedData_v4)

## Storage Options
- Local history: { hash, payload }
- On-chain: Write hash to registry contract (optional)
- Future: IPFS store entire payload, keep CID

## Collision & Risks
- SHA-256 sufficient for non-adversarial modifications
- Replay: include timestamp + user address in signed message
  
