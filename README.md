# asks-ts

TypeScript actor service for the Askaway server, built on the ACTR framework. Generated code (`src/generated`) is produced from **ask-service** (`askaway-proto/ask-service/ask.proto`).

## Setup

```bash
npm install
npm run codegen:proto
```

## Codegen

Run the command to generate from **ask-service** (refreshes `src/generated` and `src/ask_service_runtime.ts`, and updates the `src/ask_service.ts` template when needed):

```bash
npm run codegen
```

Only refresh `src/generated` from ask-service:

```bash
npm run codegen:proto
```

## Run (recommended)

```bash
npm run dev
```

`Actr.toml` is loaded from the current working directory by default. You can override it with:

```bash
ACTR_CONFIG=/path/to/Actr.toml npm run dev
```

## Routes

- `ask.AskService.Prompt`
- `ask.AskService.Attach`

## Scaffold

Implement your business logic in:

- `src/ask_service.ts`

`src/ask_service_runtime.ts` is generated and should not be edited.
