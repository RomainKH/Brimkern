// Adaptateurs standard sans dépendance externe :
//   1. createOpenAICompatible : surface `client.chat.completions.create({ messages, stream })`
//   2. createLanguageModel    : provider Vercel AI SDK (`specificationVersion: 'v1'`,
//      `doGenerate` + `doStream`) pour brancher Brimkern sur `generateText` / `streamText` / `useChat`.

import type { BrimkernSession, SessionConfig, Msg } from './index';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string }>;
}

export interface OpenAICreateParams {
  model?: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  signal?: AbortSignal;
}

export interface OpenAIChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: 'assistant'; content: string };
    finish_reason: 'stop';
  }>;
}

export interface OpenAIChatChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { role?: 'assistant'; content?: string };
    finish_reason: 'stop' | null;
  }>;
}

export type SessionFactory = (cfg: SessionConfig) => BrimkernSession;

function flattenContent(c: OpenAIMessage['content']): string {
  if (typeof c === 'string') return c;
  if (!Array.isArray(c)) return '';
  return c.map((p) => (p?.type === 'text' && typeof p.text === 'string' ? p.text : '')).join('');
}

function splitMessages(messages: OpenAIMessage[]): { system?: string; history: Msg[]; lastUser: string } {
  const sys: string[] = [];
  const conv: Msg[] = [];
  for (const m of messages) {
    const text = flattenContent(m.content);
    if (m.role === 'system') {
      if (text.trim()) sys.push(text.trim());
    } else if (m.role === 'user' || m.role === 'assistant') {
      conv.push({ role: m.role, content: text });
    }
  }
  const last = conv.length && conv[conv.length - 1].role === 'user' ? conv.pop()!.content : '';
  return { system: sys.length ? sys.join('\n\n') : undefined, history: conv, lastUser: last };
}

/**
 * Client compatible avec la surface `openai.chat.completions.create` (synchrone ou `stream: true`),
 * exécuté 100 % en local sur WebGPU.
 */
export function buildOpenAICompatible(makeSession: SessionFactory, defaults: SessionConfig = {}) {
  function create(params: OpenAICreateParams & { stream: true }): AsyncIterable<OpenAIChatChunk>;
  function create(params: OpenAICreateParams & { stream?: false }): Promise<OpenAIChatCompletion>;
  function create(params: OpenAICreateParams): Promise<OpenAIChatCompletion> | AsyncIterable<OpenAIChatChunk> {
    const { system, history, lastUser } = splitMessages(params.messages || []);
    const model = params.model || defaults.model || 'qwen3-0.6b-shop';
    const session = makeSession({
      ...defaults,
      model,
      system: system ?? defaults.system,
      history,
      maxTokens: params.max_tokens ?? defaults.maxTokens,
      temperature: params.temperature ?? defaults.temperature,
    });
    const id = `chatcmpl-bk-${Date.now().toString(36)}`;
    const created = Math.floor(Date.now() / 1000);

    if (params.stream) {
      return {
        async *[Symbol.asyncIterator]() {
          const queue: OpenAIChatChunk[] = [];
          let wake: (() => void) | null = null;
          let done = false;
          let err: unknown = null;
          let prev = '';
          let sentRole = false;

          const push = (chunk: OpenAIChatChunk) => {
            queue.push(chunk);
            wake?.();
            wake = null;
          };

          session.ask(lastUser, {
            signal: params.signal,
            onToken: (full) => {
              const delta = full.slice(prev.length);
              prev = full;
              if (!delta) return;
              const chunk: OpenAIChatChunk = {
                id,
                object: 'chat.completion.chunk',
                created,
                model,
                choices: [{ index: 0, delta: sentRole ? { content: delta } : { role: 'assistant', content: delta }, finish_reason: null }],
              };
              sentRole = true;
              push(chunk);
            },
          }).then(() => {
            push({ id, object: 'chat.completion.chunk', created, model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] });
            done = true;
            wake?.();
          }).catch((e) => {
            err = e;
            done = true;
            wake?.();
          }).finally(() => session.destroy());

          while (!done || queue.length > 0) {
            if (queue.length > 0) {
              yield queue.shift()!;
            } else {
              await new Promise<void>((r) => { wake = r; });
            }
          }
          if (err) throw err;
        },
      };
    }

    return session.ask(lastUser, { signal: params.signal })
      .then((content): OpenAIChatCompletion => ({
        id,
        object: 'chat.completion',
        created,
        model,
        choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
      }))
      .finally(() => session.destroy());
  }

  return { chat: { completions: { create } } };
}

export interface AISDKPromptPart {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<{ type: string; text?: string }>;
}

export interface AISDKCallOptions {
  prompt: AISDKPromptPart[];
  maxTokens?: number;
  temperature?: number;
  abortSignal?: AbortSignal;
}

/**
 * Provider compatible Vercel AI SDK (`LanguageModelV1` : `doGenerate` et `doStream`), utilisable
 * directement côté navigateur avec `generateText`, `streamText` ou `useChat`.
 */
export function buildLanguageModel(makeSession: SessionFactory, cfg: SessionConfig = {}) {
  const modelId = cfg.model || 'qwen3-0.6b-shop';

  function fromPrompt(prompt: AISDKPromptPart[]) {
    const msgs: OpenAIMessage[] = prompt
      .filter((p) => p.role === 'system' || p.role === 'user' || p.role === 'assistant')
      .map((p) => ({ role: p.role as 'system' | 'user' | 'assistant', content: p.content }));
    return splitMessages(msgs);
  }

  return {
    specificationVersion: 'v1' as const,
    provider: 'brimkern',
    modelId,
    defaultObjectGenerationMode: 'json' as const,

    async doGenerate(options: AISDKCallOptions) {
      const { system, history, lastUser } = fromPrompt(options.prompt || []);
      const session = makeSession({
        ...cfg,
        model: modelId,
        system: system ?? cfg.system,
        history,
        maxTokens: options.maxTokens ?? cfg.maxTokens,
        temperature: options.temperature ?? cfg.temperature,
      });
      try {
        const text = await session.ask(lastUser, { signal: options.abortSignal });
        return {
          text,
          finishReason: 'stop' as const,
          usage: { promptTokens: NaN, completionTokens: NaN },
          rawCall: { rawPrompt: lastUser, rawSettings: { model: modelId } },
        };
      } finally {
        session.destroy();
      }
    },

    async doStream(options: AISDKCallOptions) {
      const { system, history, lastUser } = fromPrompt(options.prompt || []);
      const session = makeSession({
        ...cfg,
        model: modelId,
        system: system ?? cfg.system,
        history,
        maxTokens: options.maxTokens ?? cfg.maxTokens,
        temperature: options.temperature ?? cfg.temperature,
      });
      let prev = '';
      const stream = new ReadableStream({
        start(controller) {
          session.ask(lastUser, {
            signal: options.abortSignal,
            onToken: (full) => {
              const delta = full.slice(prev.length);
              prev = full;
              if (delta) controller.enqueue({ type: 'text-delta', textDelta: delta });
            },
          }).then(() => {
            controller.enqueue({
              type: 'finish',
              finishReason: 'stop',
              usage: { promptTokens: NaN, completionTokens: NaN },
            });
            controller.close();
          }).catch((error) => {
            controller.enqueue({ type: 'error', error });
            controller.close();
          }).finally(() => session.destroy());
        },
      });
      return {
        stream,
        rawCall: { rawPrompt: lastUser, rawSettings: { model: modelId } },
      };
    },
  };
}
