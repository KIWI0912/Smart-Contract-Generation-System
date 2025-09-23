# Template Schema

## Fields
- id: string (unique)
- name: string
- version: string (semver)
- jurisdiction: string
- fields: Array<Field>
- clauses: Array<Clause>
- metadata?: { category, riskLevel, createdAt }

## Field Object
{
  "key": "partyA",
  "label": "Party A Name",
  "type": "text" | "number" | "date" | "select",
  "required": true,
  "default": ""
}

## Clause Object
{
  "id": "limitation",
  "text": "Limitation of liability ...",
  "optional": true
}

## Validation Rules
1. id must be unique
2. version must follow SemVer
3. required fields present before merge
4. no unresolved placeholders like {{UNKNOWN_KEY}}
