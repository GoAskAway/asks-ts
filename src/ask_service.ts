// ASKS_TS_SCAFFOLD
// Generated scaffold for user code.
// Fill in the TODOs with your business logic.

import type { ContextBridge, DataStream } from '@actor-rtc/actr';

import type { Ask_AssistantReply, Ask_AttachRequest, Ask_AttachResponse, Ask_UsrPromptRequest } from './generated/ask.pb.js';
import type { AskServiceHandlers } from './ask_service_runtime.js';

export class AskServiceHandler implements AskServiceHandlers {
  async prompt(request: Ask_UsrPromptRequest, _ctx: ContextBridge): Promise<Ask_AssistantReply> {
    const streamId = request.textResponseStreamId;
    const voiceStreamId = request.voiceStreamId;
    const ctx = _ctx;

    if (voiceStreamId) {
      await ctx.registerStream(voiceStreamId, (chunk) => {
        if (!chunk) {
          console.log(`Audio stream ${voiceStreamId} finished.`);
          return;
        }
        console.log(`Received audio stream chunk seq ${chunk.sequence}`);
      });
    }

    // Start a background promise to emit mock stream chunks.
    void (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const targetActrId = ctx.callId();

        for (let i = 1; i <= 3; i += 1) {
          const chunk: DataStream = {
            streamId,
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

    return {
      questionId: request.questionId,
      sessionId: request.sessionId,
      text: `Mock response to: ${request.text}`,
      streamId,
      statusCode: 200,
      errorMessage: '',
    };
  }

  async attach(request: Ask_AttachRequest, _ctx: ContextBridge): Promise<Ask_AttachResponse> {
    // TODO: Implement attach business logic.
    // TODO: Validate attachment metadata (id, filename, type).
    // TODO: Persist data and return status/error.
    void request;
    throw new Error('TODO: implement attach');
  }

}
