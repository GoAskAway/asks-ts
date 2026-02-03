// ASKS_TS_SCAFFOLD
// Generated scaffold for user code.
// Fill in the TODOs with your business logic.

import type { ContextBridge, DataStream, ActrId } from '@actor-rtc/actr';
import { v4 as uuidv4 } from 'uuid';

import type { AskService_AssistantReply, AskService_AttachRequest, AskService_AttachResponse, AskService_UnregisterRequest, AskService_UnregisterResponse, AskService_UsrPromptRequest } from './generated/ask_service.pb.js';
import type { AskServiceHandlers } from './ask_service_runtime.js';

export class AskServiceHandler implements AskServiceHandlers {
  async usrPrompt(request: AskService_UsrPromptRequest, ctx: ContextBridge): Promise<AskService_AssistantReply> {
    console.log('usrPrompt request:', JSON.stringify(request, null, 2));
    // TODO: Implement usrPrompt business logic.
    // TODO: Validate required fields (questionId, sessionId, text/voiceStreamId).
    // TODO: Perform your core processing (LLM, retrieval, workflow, etc.).
    // TODO: Populate statusCode and errorMessage on failure.
    // TODO: Set streamId if you produce a streaming response.

    const streamId = uuidv4();

    // Start a "coroutine" (background promise) to send data stream chunks
    (async () => {
      try {
        // Sleep for 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Parse actr_id from string if provided
        let targetActrId: ActrId | undefined;
        if (request.actrId) {
          try {
            targetActrId = JSON.parse(request.actrId);
          } catch (e) {
            console.error('Failed to parse actrId:', request.actrId);
          }
        }

        // Send 3 data stream chunks
        for (let i = 1; i <= 3; i++) {
          const chunk: DataStream = {
            streamId: streamId,
            sequence: i,
            payload: Buffer.from(`Chunk ${i} for stream ${streamId}`),
            metadata: [],
          };

          if (targetActrId) {
            await ctx.sendDataStream(targetActrId, chunk);
            console.log(`Sent chunk ${i} for stream ${streamId} to`, targetActrId);
          } else {
            console.log(`Prepared chunk ${i} for stream ${streamId} (no valid actrId in request):`, chunk);
          }
        }
      } catch (err) {
        console.error(`Error sending data stream ${streamId}:`, err);
      }
    })();

    // Mock implementation for usrPrompt
    return {
      questionId: request.questionId,
      sessionId: request.sessionId,
      text: `Mock response to: ${request.text}`,
      streamId: streamId,
      statusCode: 200,
      errorMessage: '',
    };
  }

  async attach(request: AskService_AttachRequest, _ctx: ContextBridge): Promise<AskService_AttachResponse> {
    console.log('attach request:', { ...request, data: request.data ? `Buffer(${request.data.length})` : 'null' });
    // TODO: Implement attach business logic.
    // TODO: Validate attachment metadata (id, filename, type).
    // TODO: Persist data and return status/error.

    // Mock implementation for attach
    return {
      id: request.id,
      statusCode: 200,
      errorMessage: '',
    };
  }

  async unregisterDataStream(request: AskService_UnregisterRequest, _ctx: ContextBridge): Promise<AskService_UnregisterResponse> {
    console.log('unregisterDataStream request:', JSON.stringify(request, null, 2));
    // TODO: Implement unregisterDataStream business logic.
    // TODO: Validate streamId and release any streaming resources.

    // Mock implementation for unregisterDataStream
    return {
      success: true,
      message: `Stream ${request.streamId} unregistered successfully`,
    };
  }

}