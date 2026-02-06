# AskService Implementation Guide

This document describes how to implement `AskService` on the service side.

## Overview

`AskService` is an Actor-RTC service that handles user prompts and attachment uploads. Implement the `AskServiceHandlers` interface and register it with `AskServiceWorkload`.

## Core Handlers

Implement the `AskServiceHandler` class in `src/ask_service.ts`. The class includes the following core methods:

### 1. `prompt`

Handle user text or voice prompts.

- **Input**: `Ask_UsrPromptRequest` (contains `questionId`, `sessionId`, `text`, `voiceStreamId`, `textResponseStreamId`, etc.)
- **Output**: `Ask_AssistantReply` (includes response text, `streamId`, etc.)
- **Logic tips**:
  - Validate request fields.
  - Call your LLM or backend workflow.
  - If you need streaming responses, generate a `streamId` and send chunks via `ctx.sendDataStream`.

```typescript
async prompt(request: Ask_UsrPromptRequest, ctx: Context): Promise<Ask_AssistantReply> {
  const streamId = uuidv4();

  (async () => {
    const targetActrId = ctx.callId();
    if (targetActrId) {
      await ctx.sendDataStream(targetActrId, {
        streamId,
        sequence: 1,
        payload: Buffer.from('Hello from stream'),
        metadata: [],
      });
    }
  })();

  return {
    questionId: request.questionId,
    sessionId: request.sessionId,
    text: 'Processing your request...',
    streamId,
    statusCode: 200,
    errorMessage: '',
  };
}
```

### 2. `attach`

Handle attachment uploads (images, documents, audio, etc.).

- **Input**: `Ask_AttachRequest` (contains `id`, `filename`, `type`, `data` bytes)
- **Output**: `Ask_AttachResponse`
- **Logic tips**:
  - Validate attachment metadata.
  - Persist `data` to storage (e.g. S3).
  - Return processing status.

```typescript
async attach(request: Ask_AttachRequest, _ctx: Context): Promise<Ask_AttachResponse> {
  return {
    id: request.id,
    statusCode: 200,
    errorMessage: '',
  };
}
```

## How To Run

1. Implement `AskServiceHandler`.
2. In the entry file, use `createAskServiceWorkload` to create the workload.
3. Register the workload with the Actor system.

```typescript
import { createAskServiceWorkload } from './ask_service_runtime.js';
import { AskServiceHandler } from './ask_service.js';

const handler = new AskServiceHandler();
const workload = createAskServiceWorkload(handler);
// Register to actor node...
```
