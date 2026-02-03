import path from 'node:path';

import { ActrSystem } from '@actor-rtc/actr';

import { AskServiceHandler } from './ask_service.js';
import { createAskServiceWorkload } from './ask_service_runtime.js';

function resolveConfigPath(): string {
  const configured = process.env.ACTR_CONFIG;
  if (configured && configured.trim().length > 0) {
    return configured;
  }

  return path.resolve(process.cwd(), 'Actr.toml');
}

async function main(): Promise<void> {
  const configPath = resolveConfigPath();
  const system = await ActrSystem.fromConfig(configPath);
  const handler = new AskServiceHandler();
  const node = system.attach(createAskServiceWorkload(handler));
  const actorRef = await node.start();

  console.log('AskService actor started:', actorRef.actorId());
  await actorRef.waitForShutdown();
}

main().catch((error) => {
  console.error('AskService actor failed:', error);
  process.exitCode = 1;
});
