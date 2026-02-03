# asks-ts

TypeScript actor service for `ask_service.proto`, built on the ACTR framework.

## Setup

```bash
npm install
```

## Codegen

使用命令生成（会刷新 `src/generated` 与 `src/ask_service_runtime.ts`，并在需要时更新 `src/ask_service.ts` 模板）：

```bash
npm run codegen
```

仅刷新 `src/generated`：

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

- `ask_service.AskService.UsrPrompt`
- `ask_service.AskService.Attach`
- `ask_service.AskService.UnregisterDataStream`

## Scaffold

Implement your business logic in:

- `src/ask_service.ts`

The scaffold methods include TODO markers for you to fill in.
`src/ask_service_runtime.ts` is generated and should not be edited.
