# asks-ts

TypeScript actor service for `ask.proto`, built on the ACTR framework.

## Setup

```bash
npm install
```

## Codegen

Run the command to generate (refreshes `src/generated` and `src/ask_service_runtime.ts`, and updates the `src/ask_service.ts` template when needed):

```bash
npm run codegen
```

Only refresh `src/generated`:

```bash
npm run codegen:proto
```

## Run

```bash
npm run build
npm run start
```

`Actr.toml` is loaded from the current working directory by default. You can override it with:

```bash
ACTR_CONFIG=/path/to/Actr.toml npm run start
```

## Routes

- `ask.AskService.Prompt`
- `ask.AskService.Attach`

## Scaffold

Implement your business logic in:

- `src/ask_service.ts`

`src/ask_service_runtime.ts` is generated and should not be edited.
