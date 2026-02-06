#!/usr/bin/env node

'use strict';

const path = require('path');
const { execFileSync } = require('child_process');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function runNode(scriptPath, args, cwd) {
  execFileSync(process.execPath, [scriptPath, ...args], { stdio: 'inherit', cwd });
}

function main() {
  const args = parseArgs(process.argv);
  const force = Boolean(args.force);
  const cwd = process.cwd();
  const scriptsDir = path.join(cwd, 'scripts');

  const generateProtoScript = path.join(scriptsDir, 'generate-generated.cjs');
  const generateServiceScript = path.join(scriptsDir, 'generate-ask-service.cjs');

  runNode(generateProtoScript, [
    '--config',
    'Actr.toml',
    '--proto-root',
    'askaway-proto',
    '--out',
    'src/generated',
    '--dist-import',
    '@actor-rtc/actr',
  ], cwd);

  const serviceArgs = [
    '--proto',
    'askaway-proto/ask-service/ask.proto',
    '--out-dir',
    'src',
    '--service',
    'AskService',
  ];

  if (force) {
    serviceArgs.push('--force');
  }

  runNode(generateServiceScript, serviceArgs, cwd);
}

main();
