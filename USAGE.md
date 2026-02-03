# AskService Implementation Guide

本文档介绍如何在 Service 端实现 `AskService`。

## 概述

`AskService` 是一个基于 Actor-RTC 框架的服务，主要负责处理用户的提问、附件上传以及数据流的管理。开发者需要实现 `AskServiceHandlers` 接口，并将其注册到 `AskServiceWorkload` 中。

## 核心接口实现

你需要实现 `src/ask_service.ts` 中的 `AskServiceHandler` 类。该类包含以下三个核心函数：

### 1. `usrPrompt`
处理用户的文本或语音提问。

- **输入**: `AskService_UsrPromptRequest` (包含 `questionId`, `sessionId`, `text`, `voiceStreamId` 等)
- **输出**: `AskService_AssistantReply` (包含回答文本、`streamId` 等)
- **逻辑建议**:
    - 验证请求参数。
    - 调用 LLM 或其他后端服务生成回答。
    - 如果需要流式返回（例如语音或长文本），生成一个 `streamId` 并通过 `ctx.sendDataStream` 发送数据块。

```typescript
async usrPrompt(request: AskService_UsrPromptRequest, ctx: ContextBridge): Promise<AskService_AssistantReply> {
  const streamId = uuidv4();

  // 异步发送流式数据示例
  (async () => {
    const targetActrId = ctx.callId();
    if (targetActrId) {
      await ctx.sendDataStream(targetActrId, {
        streamId: streamId,
        sequence: 1,
        payload: Buffer.from("Hello from stream"),
        metadata: [],
      });
    }
  })();

  return {
    questionId: request.questionId,
    sessionId: request.sessionId,
    text: "Processing your request...",
    streamId: streamId,
    statusCode: 200,
    errorMessage: '',
  };
}
```

### 2. `attach`
处理附件（如图片、文档、音频）的上传。

- **输入**: `AskService_AttachRequest` (包含 `id`, `filename`, `type`, `data` 字节流)
- **输出**: `AskService_AttachResponse`
- **逻辑建议**:
    - 验证附件元数据。
    - 将 `data` 持久化到存储服务（如 S3）。
    - 返回处理状态。

```typescript
async attach(request: AskService_AttachRequest, _ctx: ContextBridge): Promise<AskService_AttachResponse> {
  // 实现附件保存逻辑
  return {
    id: request.id,
    statusCode: 200,
    errorMessage: '',
  };
}
```

### 3. `unregisterDataStream`
注销不再需要的数据流，释放相关资源。

- **输入**: `AskService_UnregisterRequest` (包含 `streamId`)
- **输出**: `AskService_UnregisterResponse`
- **逻辑建议**:
    - 根据 `streamId` 停止相关的异步任务或清理内存缓存。

```typescript
async unregisterDataStream(request: AskService_UnregisterRequest, _ctx: ContextBridge): Promise<AskService_UnregisterResponse> {
  // 清理资源逻辑
  return {
    success: true,
    message: `Stream ${request.streamId} unregistered`,
  };
}
```

## 如何运行

1. 实现 `AskServiceHandler` 类。
2. 在入口文件中使用 `createAskServiceWorkload` 创建 workload。
3. 将 workload 注册到 Actor 系统中。

```typescript
import { createAskServiceWorkload } from './ask_service_runtime.js';
import { AskServiceHandler } from './ask_service.js';

const handler = new AskServiceHandler();
const workload = createAskServiceWorkload(handler);
// 注册到 actor 节点...
```
