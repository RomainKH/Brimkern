"use client";

// Conversation history: the persisted list, the auto-save effect, and the new/open/delete handlers.
// Factored out of page.tsx to keep the component lean.
//
// Ownership note: `currentConvId` is deliberately NOT owned here. The model engine needs it (to tag
// saves) and the on-mount auto-resume needs the engine's loader — owning it here would make the two
// hooks circular. So the page owns currentConvId and passes it (plus its setter) into this hook; the
// page also keeps the bridge mount-effect (cache + listConversations + load-model-then-restore),
// calling the `hydrate`/`restore`/`begin` helpers this hook exposes.

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { saveConversation, deleteConversation, deriveTitle, type Conversation } from '@/lib/chatStore';
import type { ArchType } from '@/lib/presets';
import type { CustomWebModel } from '@/lib/webgpu/model';
import type { Message } from './types';
import { nextMsgId } from './ids';

type ModelState = 'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error';

interface Deps {
  currentConvId: string | null;
  setCurrentConvId: Dispatch<SetStateAction<string | null>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  modelState: ModelState;
  setModelState: Dispatch<SetStateAction<ModelState>>;
  // CustomWebModel ou adaptateur lfm2 — seul reset() est utilisé ici.
  activeModel: (Pick<CustomWebModel, 'reset'> & object) | null;
  loadedModelName: string;
  loadedModelUrl: string;
  selectedTokenizerId: string;
  setSelectedTokenizerId: Dispatch<SetStateAction<string>>;
  modelArchType: ArchType;
  setModelArchType: Dispatch<SetStateAction<ArchType>>;
  // When in image mode, the active generator's identity — persisted on the conversation so reopening
  // it can auto-reload the image model (LLM fields are empty in image mode).
  imageModel?: { name: string; url: string } | null;
}

export function useConversations(deps: Deps) {
  const {
    currentConvId, setCurrentConvId, messages, setMessages,
    modelState, setModelState, activeModel, loadedModelName, loadedModelUrl,
    selectedTokenizerId, setSelectedTokenizerId, modelArchType, setModelArchType, imageModel,
  } = deps;

  // Conversation history (persisted in IndexedDB, independent of the loaded model).
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const convCreatedAt = useRef<Map<string, number>>(new Map());
  // Signature of each conversation's last-persisted messages — so merely OPENING a chat (which sets
  // `messages`) doesn't re-save it with a fresh updatedAt and bump it to the top of the history.
  const convSavedSig = useRef<Map<string, string>>(new Map());

  const sigOf = (msgs: { role: string; content: string; isError?: boolean }[]) =>
    JSON.stringify(msgs.map((m) => [m.role, m.content, m.isError]));

  // Persist the current conversation when it changes (but not mid-generation — only the final state
  // once a turn completes). The welcome message is excluded.
  useEffect(() => {
    if (!currentConvId || modelState === 'generating' || modelState === 'initializing') return;
    const real = messages.filter((m) => m.id !== 'welcome');
    if (real.length === 0) return;
    // Skip if the messages haven't actually changed since the last save/open — opening a chat sets
    // `messages` but must NOT bump its updatedAt (which would reorder the history confusingly).
    const sig = sigOf(real);
    if (convSavedSig.current.get(currentConvId) === sig) return;
    convSavedSig.current.set(currentConvId, sig);
    const now = Date.now();
    const createdAt = convCreatedAt.current.get(currentConvId) ?? now;
    convCreatedAt.current.set(currentConvId, createdAt);
    const conv: Conversation = {
      id: currentConvId,
      title: deriveTitle(real),
      createdAt,
      updatedAt: now,
      // Persist the blurred thumb + params only, NOT the heavy full `url` (regenerated on click).
      messages: real.map((m) => ({
        id: m.id, role: m.role, content: m.content, isError: m.isError, timings: m.timings,
        // `full` (img2img) : seule image persistée entière — non régénérable depuis prompt+seed.
        image: m.image ? { w: m.image.w, h: m.image.h, thumb: m.image.thumb, prompt: m.image.prompt, seed: m.image.seed, full: m.image.full } : undefined,
      })),
      // In image mode record the generator identity (so reopening auto-loads it); else the LLM's.
      modelName: imageModel ? imageModel.name : loadedModelName,
      modelUrl: imageModel ? imageModel.url : loadedModelUrl,
      tokenizerId: imageModel ? undefined : selectedTokenizerId,
      archType: imageModel ? undefined : modelArchType,
    };
    saveConversation(conv)
      .then(() => setConversations((prev) => [conv, ...prev.filter((c) => c.id !== conv.id)]))
      .catch(() => { /* ignore persistence errors */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentConvId, modelState]);

  // --- helpers for the page's bridge mount-effect ---

  // Seed the list + createdAt map from IndexedDB (called once on mount, before any restore).
  const hydrateConversations = (cs: Conversation[]) => {
    setConversations(cs);
    for (const c of cs) convCreatedAt.current.set(c.id, c.createdAt);
  };

  // Drop a saved conversation's messages into the view. Baselines its saved-signature so the auto-save
  // effect sees "no change" and doesn't re-save / reorder. Used by auto-resume and openConversation.
  const restoreConversation = (conv: Conversation) => {
    convSavedSig.current.set(conv.id, sigOf(conv.messages));
    setCurrentConvId(conv.id);
    // Re-stamp ids on load: guarantees uniqueness even for conversations saved before unique ids
    // existed (old "m0/m1" ids, sometimes duplicated) → no more duplicate-key crash on reopen.
    // Les images affinées (img2img) sont persistées entières dans `full` → ré-affichables direct.
    setMessages(conv.messages.map((m) => ({
      ...m, id: nextMsgId(),
      ...(m.image?.full && !m.image.url ? { image: { ...m.image, url: m.image.full } } : {}),
    })) as Message[]);
    if (conv.archType) setModelArchType(conv.archType as ArchType);
    if (conv.tokenizerId) setSelectedTokenizerId(conv.tokenizerId);
  };

  // Start a fresh saved conversation id (first message of a new chat). Stamps its createdAt.
  const beginConversation = () => {
    const id = `conv-${Date.now()}`;
    convCreatedAt.current.set(id, Date.now());
    setCurrentConvId(id);
  };

  // --- sidebar handlers ---

  // New conversation (modern LLM style): reset the model and show a fresh welcome, or fall back to
  // the idle landing if no model is loaded.
  const handleNewChat = () => {
    setCurrentConvId(null); // next message starts a fresh saved conversation
    if (activeModel) {
      activeModel.reset();
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Nouvelle conversation démarrée avec **${loadedModelName}**.\n\n` +
                   `Prêt à recevoir vos questions. Toutes les opérations matricielles s'exécutent localement sur votre GPU.`
        }
      ]);
    } else {
      setMessages([]);
      setModelState('idle');
    }
  };

  // Open a saved conversation (view its messages; load a model to continue it).
  const openConversation = (conv: Conversation) => {
    if (modelState === 'generating') return;
    if (activeModel) activeModel.reset();
    convCreatedAt.current.set(conv.id, conv.createdAt);
    restoreConversation(conv);
    if (modelState === 'idle') setModelState(activeModel ? 'ready' : 'idle');
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation(id).catch(() => {});
    convCreatedAt.current.delete(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === currentConvId) { setCurrentConvId(null); setMessages([]); }
  };

  return {
    conversations,
    setConversations,
    hydrateConversations,
    restoreConversation,
    beginConversation,
    handleNewChat,
    openConversation,
    handleDeleteConversation,
  };
}
