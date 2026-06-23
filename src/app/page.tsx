"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, Settings, Send, Trash2, CheckCircle, AlertCircle, 
  Loader2, Menu, X, Download, Upload, Play, Sparkles, Bot, 
  User, Copy, Square, Info, ShieldCheck, Database, ArrowRight,
  Plus, Flame
} from 'lucide-react';
import { AutoTokenizer } from '@huggingface/transformers';
import { WebGpuEngine } from '@/lib/webgpu/kernels';
import { CustomWebModel } from '@/lib/webgpu/model';
import { parseGguf, type Manifest } from '@/lib/webgpu/ggufParser';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timings?: {
    prompt_tokens: number;
    prompt_time_ms: number;
    prompt_speed_ts: number;
    decode_tokens: number;
    decode_time_ms: number;
    decode_speed_ts: number;
    total_time_ms: number;
  };
  isError?: boolean;
}

// Preset models suitable for browser WebGPU running
const PRESET_MODELS = [
  {
    name: "Qwen 2.5 0.5B Instruct (Q8_0)",
    url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q8_0.gguf",
    size: "597 Mo",
    desc: "Ultra-rapide et économe. Idéal pour tester notre moteur custom.",
    tokenizer: "Qwen/Qwen2.5-0.5B-Instruct",
    type: "qwen" as const
  },
  {
    name: "Llama 3.2 1B Instruct (Q4_K_M)",
    url: "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    size: "708 Mo",
    desc: "Modèle Meta compact de haute qualité, optimisé pour le format Llama 3.",
    tokenizer: "Xenova/llama-3-tokenizer",
    type: "llama3" as const
  },
  {
    name: "Qwen 2.5 Coder 1.5B Instruct (Q4_K_M)",
    url: "https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf",
    size: "1,02 Go",
    desc: "Spécialisé pour le code et l'analyse technique.",
    tokenizer: "Qwen/Qwen2.5-Coder-1.5B-Instruct",
    type: "qwen" as const
  }
];

const TOKENIZER_PRESETS = [
  { name: "Qwen 2 / 2.5", id: "Qwen/Qwen2.5-0.5B-Instruct", type: "qwen" as const },
  { name: "Llama 3 / 3.2", id: "Xenova/llama-3-tokenizer", type: "llama3" as const },
  { name: "Llama 2 / Mistral", id: "Xenova/llama-tokenizer", type: "llama2" as const },
  { name: "Gemma 2", id: "Xenova/gemma-tokenizer", type: "gemma" as const }
];

const SUGGESTED_PROMPTS = [
  { title: "Expliquer le WebGPU", text: "Explique-moi ce qu'est WebGPU et en quoi le fait d'exécuter des calculs matriciels directement en WGSL dans le navigateur est révolutionnaire." },
  { title: "Écrire du code Python", text: "Rédige un script Python simple qui trie une liste d'utilisateurs par score décroissant." },
  { title: "Idées créatives", text: "Propose-moi 3 concepts de projets innovants utilisant l'IA locale dans le navigateur." }
];

function App() {
  // App States
  const [modelState, setModelState] = useState<'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [webGpuSupported, setWebGpuSupported] = useState<boolean | null>(null);
  
  // Model file loader states
  const [activeTab, setActiveTab] = useState<'models' | 'local' | 'hf'>('models');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedHFModelUrl, setSelectedHFModelUrl] = useState<string>(PRESET_MODELS[0].url);
  const [customHFUrl, setCustomHFUrl] = useState<string>('');
  
  // Tokenizer selection
  const [selectedTokenizerId, setSelectedTokenizerId] = useState<string>(TOKENIZER_PRESETS[0].id);
  const [modelArchType, setModelArchType] = useState<'qwen' | 'llama3' | 'llama2' | 'gemma'>('qwen');
  
  // Generation Parameters
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(512);
  const [systemPrompt, setSystemPrompt] = useState<string>("You are a helpful AI assistant.");
  
  // Loading progress
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<{ loaded: number; total: number; percentage: number } | null>(null);
  
  // Execution states
  const [activeEngine, setActiveEngine] = useState<WebGpuEngine | null>(null);
  const [activeModel, setActiveModel] = useState<CustomWebModel | null>(null);
  const [activeTokenizer, setActiveTokenizer] = useState<any>(null);
  const [loadedModelName, setLoadedModelName] = useState<string>('');
  const [modelMetadata, setModelMetadata] = useState<any>(null);
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  
  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Detect WebGPU on mount
  useEffect(() => {
    const detect = async () => {
      const gpu = (navigator as any).gpu;
      if (!gpu) {
        setWebGpuSupported(false);
        return;
      }
      try {
        const adapter = await gpu.requestAdapter();
        setWebGpuSupported(!!adapter);
      } catch (e) {
        console.error("Erreur détection WebGPU:", e);
        setWebGpuSupported(false);
      }
    };
    detect();
  }, []);

  // DEBUG (build v4): capture the REAL stack of any uncaught error / promise rejection, since
  // the React overlay mis-maps it to page.tsx:100. Remove once the load error is fixed.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[brimkern build v4] app mounted');
    const onErr = (e: ErrorEvent) => console.error('[brimkern] window error:', e.message, '\nSTACK:\n', e.error?.stack);
    const onRej = (e: PromiseRejectionEvent) => console.error('[brimkern] unhandledrejection:', (e.reason as any)?.message, '\nSTACK:\n', (e.reason as any)?.stack);
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej);
    return () => { window.removeEventListener('error', onErr); window.removeEventListener('unhandledrejection', onRej); };
  }, []);

  // Update tokenizer type when selecting presets
  useEffect(() => {
    if (activeTab === 'hf') {
      const preset = PRESET_MODELS.find(m => m.url === selectedHFModelUrl);
      if (preset) {
        setSelectedTokenizerId(preset.tokenizer);
        setModelArchType(preset.type);
      }
    }
  }, [selectedHFModelUrl, activeTab]);

  useEffect(() => {
    const selected = TOKENIZER_PRESETS.find(t => t.id === selectedTokenizerId);
    if (selected) {
      setModelArchType(selected.type);
    }
  }, [selectedTokenizerId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Resize input box
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [userInput]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Cache API helper to download and cache files locally
  const fetchWithCacheAndProgress = async (url: string, onProgress: (loaded: number, total: number) => void): Promise<Blob> => {
    const cache = await caches.open('brimkern-model-cache');
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      setLoadingStep('Chargement du modèle pré-téléchargé depuis le cache du navigateur...');
      return await cachedResponse.blob();
    }

    setLoadingStep('Téléchargement du modèle GGUF depuis Hugging Face (mis en cache locale)...');
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Impossible d'obtenir le flux de lecture.");
    
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.byteLength;
      onProgress(loaded, total);
    }
    
    const blob = new Blob(chunks as any);
    
    // Save to Cache API
    try {
      await cache.put(url, new Response(blob, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': blob.size.toString()
        }
      }));
    } catch (e) {
      console.warn("Échec de la mise en cache (quota dépassé ?) :", e);
    }
    
    return blob;
  };

  // Helper to format prompt
  const formatPrompt = (chatMsgs: { role: string; content: string }[], archType: 'qwen' | 'llama3' | 'llama2' | 'gemma', systemText: string) => {
    let formatted = '';
    
    if (archType === 'qwen') {
      if (systemText.trim()) {
        formatted += `<|im_start|>system\n${systemText}<|im_end|>\n`;
      }
      for (const msg of chatMsgs) {
        formatted += `<|im_start|>${msg.role}\n${msg.content}<|im_end|>\n`;
      }
      formatted += `<|im_start|>assistant\n`;
    } else if (archType === 'llama3') {
      formatted += `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemText}<|eot_id|>\n`;
      for (const msg of chatMsgs) {
        formatted += `<|start_header_id|>${msg.role}<|end_header_id|>\n\n${msg.content}<|eot_id|>\n`;
      }
      formatted += `<|start_header_id|>assistant<|end_header_id|>\n\n`;
    } else if (archType === 'llama2') {
      formatted += `<s>[INST] <<SYS>>\n${systemText}\n<</SYS>>\n\n`;
      for (const msg of chatMsgs) {
        if (msg.role === 'user') {
          formatted += `${msg.content} [/INST] `;
        } else if (msg.role === 'assistant') {
          formatted += `${msg.content} </s><s>[INST] `;
        }
      }
    } else if (archType === 'gemma') {
      if (systemText.trim()) {
        formatted += `<start_of_turn>model\n${systemText}<end_of_turn>\n`;
      }
      for (const msg of chatMsgs) {
        formatted += `<start_of_turn>${msg.role === 'assistant' ? 'model' : 'user'}\n${msg.content}<end_of_turn>\n`;
      }
      formatted += `<start_of_turn>model\n`;
    }
    
    return formatted;
  };

  const isStopToken = (tokenId: number, text: string, archType: 'qwen' | 'llama3' | 'llama2' | 'gemma') => {
    if (tokenId === 2 && archType === 'llama2') return true;
    if (tokenId === 1 && archType === 'gemma') return true;
    if (tokenId === 107 && archType === 'gemma') return true;
    if (tokenId === 128009 && archType === 'llama3') return true;
    if (tokenId === 128001 && archType === 'llama3') return true;
    if (tokenId === 151645 && archType === 'qwen') return true;
    if (tokenId === 151643 && archType === 'qwen') return true;
    
    const trimmed = text.trim();
    return trimmed === '<|im_end|>' || trimmed === '<|eot_id|>' || trimmed === '</s>' || trimmed === '<end_of_turn>';
  };

  // Common model loader logic
  const loadModelEngine = async (fileBlob: Blob, modelName: string) => {
    setModelState('initializing');
    setErrorMsg(null);
    setLoadingProgress(null);
    
    try {
      // 1. Parse GGUF Metadata in JS
      setLoadingStep('Analyse de la structure GGUF en cours...');
      const manifest = await parseGguf(fileBlob);
      console.log("Manifest GGUF extrait :", manifest);
      
      // 2. Initialize WebGPU Engine compiled in WGSL
      setLoadingStep('Compilation des kernels WebGPU (WGSL)...');
      const engine = new WebGpuEngine();
      const initialized = await engine.init();
      if (!initialized) {
        throw new Error("Votre navigateur ne supporte pas WebGPU. Veuillez activer l'accélération matérielle ou utiliser Google Chrome.");
      }
      
      // 3. Self-validate compute shaders to verify correctness
      setLoadingStep('Validation interne des calculs matriciels du GPU...');
      const validated = await engine.selfValidate();
      if (!validated) {
        throw new Error(
          "Échec de la validation des kernels WebGPU. Les shaders WGSL ne s'exécutent pas correctement." +
          (engine.validationFailure ? ` (étape : ${engine.validationFailure})` : '')
        );
      }
      
      // 4. Initialize Custom Model Runner
      setLoadingStep('Initialisation du modèle...');
      const model = new CustomWebModel(engine, fileBlob, manifest);
      
      // 5. Load Tokenizer
      setLoadingStep('Chargement du Tokenizer (Hugging Face)...');
      let tokenizer;
      // eslint-disable-next-line no-console
      console.log('[brimkern build v4] loading tokenizer:', selectedTokenizerId);
      try {
        tokenizer = await AutoTokenizer.from_pretrained(selectedTokenizerId);
        // eslint-disable-next-line no-console
        console.log('[brimkern build v4] tokenizer loaded OK:', (tokenizer as any)?.constructor?.name);
      } catch (te: any) {
        throw new Error(
          `Impossible de charger le tokenizer « ${selectedTokenizerId} » : ${te?.message || te}. ` +
          `Vérifiez que ce dépôt Hugging Face est public et contient tokenizer.json + tokenizer_config.json.`
        );
      }
      
      // Clean previous instances (free the previous model's persistent GPU buffers)
      if (activeModel) {
        activeModel.unload();
      }
      
      setActiveEngine(engine);
      setActiveModel(model);
      setActiveTokenizer(tokenizer);
      setLoadedModelName(modelName);
      setModelMetadata(manifest);
      setModelState('ready');
      // eslint-disable-next-line no-console
      console.log('[brimkern build v4] model READY — no tokenizer encode happened during load');
      
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Bonjour ! Le modèle **${modelName}** a été chargé avec succès grâce à nos kernels WebGPU custom.\n\n` +
                   `**Caractéristiques du modèle :**\n` +
                   `- Architecture : \`${manifest.arch}\`\n` +
                   `- Blocs (couches) : \`${manifest.config.blockCount}\`\n` +
                   `- Dimension d'embd : \`${manifest.config.d}\` (Têtes : \`${manifest.config.nHeads}\`)\n` +
                   `- Tokenizer : \`${selectedTokenizerId}\` (\`${modelArchType}\`)\n\n` +
                   `Vous pouvez lui envoyer vos questions, tous les calculs matriciels s'exécuteront localement dans ce navigateur.`
        }
      ]);
    } catch (e: any) {
      console.error("Erreur initialisation modèle custom:", e);
      setErrorMsg(e.message || String(e));
      setModelState('error');
    }
  };

  // New conversation handler (modern LLM style)
  const handleNewChat = () => {
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

  const handleLoadModelFromUrl = async (url: string) => {
    if (!url) return;
    
    // Auto-detect tokenizer and architecture presets
    const preset = PRESET_MODELS.find(m => m.url === url);
    if (preset) {
      setSelectedTokenizerId(preset.tokenizer);
      setModelArchType(preset.type);
    }
    
    setModelState('initializing');
    setErrorMsg(null);
    setLoadingProgress(null);
    
    const parts = url.split('/');
    const name = parts[parts.length - 1];
    
    try {
      const blob = await fetchWithCacheAndProgress(url, (loaded, total) => {
        const percentage = Math.round((loaded / total) * 100);
        setLoadingProgress({ loaded, total, percentage });
      });
      await loadModelEngine(blob, name);
    } catch (e: any) {
      console.error("Erreur de téléchargement du modèle:", e);
      setErrorMsg(`Erreur de téléchargement : ${e.message || String(e)}`);
      setModelState('error');
    }
  };

  // Click handler for Local Model
  const handleLoadLocalModel = async () => {
    if (!selectedFile) return;
    await loadModelEngine(selectedFile, selectedFile.name);
  };

  // Click handler for HF Model
  const handleLoadHFModel = async () => {
    const url = selectedHFModelUrl === 'custom' ? customHFUrl : selectedHFModelUrl;
    await handleLoadModelFromUrl(url);
  };

  // Autoregressive generation loop
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim() || modelState !== 'ready' || !activeModel || !activeTokenizer) return;
    
    const activeAbortController = new AbortController();
    abortControllerRef.current = activeAbortController;
    
    const userMsgId = Date.now().toString();
    const newUserMessage: Message = { id: userMsgId, role: 'user', content: text };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setModelState('generating');
    
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);
    
    try {
      const sessionId = Date.now().toString();
      activeModel.reset(); // Clear old KV cache state
      
      // Filter out errors and welcome message for prompt history
      const prevHistory = messages
        .filter(m => !m.isError && m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));
      
      const chatHistory = [...prevHistory, { role: 'user' as const, content: text }];
      const prompt = formatPrompt(chatHistory, modelArchType, systemPrompt);
      // eslint-disable-next-line no-console
      console.log('[brimkern build v3] encode prompt:', { type: typeof prompt, len: prompt?.length, archType: modelArchType, head: String(prompt).slice(0, 60) });
      if (prompt == null || prompt === '') throw new Error(`Prompt vide/null (archType=${modelArchType}). Redémarrez le serveur (Ctrl-C + npm run dev) puis hard reload.`);

      // 1. Encode prompt. transformers v4 returns input_ids as a BigInt64Array, so coerce each
      // id to a plain Number — the WebGPU engine indexes with it (BigInt × Number would throw).
      const encoded = await activeTokenizer(prompt);
      const promptTokens = Array.from(encoded.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
      
      // 2. Prefill phase (forward pass over prompt)
      const tPrefill0 = performance.now();
      
      let currentToken = await activeModel.generateNextKV(promptTokens, 0, sessionId);
      
      const tPrefill1 = performance.now();
      const prefillTimeMs = tPrefill1 - tPrefill0;
      
      // Detokenize first token
      let assistantText = await activeTokenizer.decode([currentToken]);
      const generatedTokens = [currentToken];
      
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return { ...m, content: assistantText };
        }
        return m;
      }));
      
      // 3. Autoregressive decoding phase
      const tDecodeStart = performance.now();
      let stepCount = 1;
      
      while (stepCount < maxTokens) {
        if (activeAbortController.signal.aborted) break;
        
        // Single token forward step utilizing the KV cache
        const nextToken = await activeModel.generateNextKV(
          [currentToken], 
          promptTokens.length + stepCount - 1, 
          sessionId
        );
        
        currentToken = nextToken;
        generatedTokens.push(currentToken);
        stepCount++;
        
        // Detokenize the generated token sequence
        const newText = await activeTokenizer.decode(generatedTokens);
        assistantText = newText;
        
        // Real-time timings calc
        const tDecodeNow = performance.now();
        const decodeElapsedMs = tDecodeNow - tDecodeStart;
        const promptSpeed = promptTokens.length / (prefillTimeMs / 1000);
        const decodeSpeed = (stepCount - 1) / (decodeElapsedMs / 1000);
        
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return { 
              ...m, 
              content: assistantText,
              timings: {
                prompt_tokens: promptTokens.length,
                prompt_time_ms: prefillTimeMs,
                prompt_speed_ts: promptSpeed,
                decode_tokens: stepCount,
                decode_time_ms: decodeElapsedMs,
                decode_speed_ts: decodeSpeed,
                total_time_ms: prefillTimeMs + decodeElapsedMs
              }
            };
          }
          return m;
        }));
        
        // Check for stop tokens
        if (isStopToken(currentToken, assistantText.slice(-24), modelArchType)) {
          break;
        }
      }
      
      setModelState('ready');
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('abort') || activeAbortController.signal.aborted) {
        setModelState('ready');
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId && m.content === '') {
            return { ...m, content: "*Génération interrompue par l'utilisateur.*" };
          }
          return m;
        }));
      } else {
        console.error("Erreur de calcul WebGPU :", e);
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return { 
              ...m, 
              content: `Erreur d'exécution matricielle GPU : ${e.message || String(e)}`,
              isError: true 
            };
          }
          return m;
        }));
        setModelState('ready');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setModelState('ready');
    }
  };

  const handleUnloadModel = () => {
    if (activeModel) {
      activeModel.unload();
    }
    setActiveEngine(null);
    setActiveModel(null);
    setActiveTokenizer(null);
    setLoadedModelName('');
    setModelMetadata(null);
    setMessages([]);
    setModelState('idle');
  };

  const handleClearCache = async () => {
    if (confirm("Voulez-vous vider le cache local ? Tous les modèles téléchargés depuis Hugging Face seront supprimés.")) {
      try {
        const cache = await caches.open('brimkern-model-cache');
        const keys = await cache.keys();
        for (const key of keys) {
          await cache.delete(key);
        }
        alert("Cache vidé !");
      } catch (e: any) {
        alert("Erreur: " + e.message);
      }
    }
  };

  // Copy message
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePresetPromptClick = (text: string) => {
    if (modelState === 'ready') {
      handleSendMessage(text);
    } else {
      setUserInput(text);
    }
  };

  // Markdown-like formatting helper
  const renderMessageContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3);
        
        return (
          <div key={index} style={{ position: 'relative', marginTop: '12px', marginBottom: '12px' }}>
            {language && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 12,
                transform: 'translateY(-50%)',
                background: 'var(--accent)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)'
              }}>
                {language}
              </div>
            )}
            <pre style={{ margin: 0 }}>
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return (
        <p key={index} style={{ margin: '0 0 10px 0', lineHeight: '1.6' }}>
          {inlineParts.map((subPart, subIndex) => {
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return <code key={subIndex}>{subPart.slice(1, -1)}</code>;
            }
            return subPart;
          })}
        </p>
      );
    });
  };

  return (
    <div className="app-container">
      {/* Mobile Toggle Button */}
      <button 
        className="circle-btn" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 200,
          background: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}
        id="sidebar-toggle-btn"
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* LEFT SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">B</div>
          <div className="logo-text">Brimkern</div>
        </div>

        <div style={{ padding: '16px 20px 0 20px' }}>
          <button 
            className="new-chat-btn"
            onClick={handleNewChat}
            disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
          >
            <Plus size={16} />
            <span>Nouvelle conversation</span>
          </button>
        </div>

        <div className="sidebar-content">
          {/* Section: WebGPU Compatibility */}
          <div className="sidebar-section">
            <div className="section-title">
              <ShieldCheck size={14} /> compatibilité matérielle
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Moteur WebGPU :</span>
                {webGpuSupported === null ? (
                  <span className="status-badge unsupported">Vérification...</span>
                ) : webGpuSupported ? (
                  <span className="status-badge supported">Actif (WGSL)</span>
                ) : (
                  <span className="status-badge unsupported">Non supporté</span>
                )}
              </div>
            </div>
          </div>

          {/* Section: GGUF Loader */}
          <div className="sidebar-section">
            <div className="section-title">
              <Database size={14} /> Chargeur de modèle
            </div>
            
            <div className="card" style={{ padding: '12px' }}>
              <div className="tabs-container" style={{ gap: '2px' }}>
                <button 
                  className={`tab-btn ${activeTab === 'models' ? 'active' : ''}`}
                  onClick={() => setActiveTab('models')}
                  disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  style={{ fontSize: '11px', padding: '6px 4px' }}
                >
                  <Flame size={12} /> Modèles
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'local' ? 'active' : ''}`}
                  onClick={() => setActiveTab('local')}
                  disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  style={{ fontSize: '11px', padding: '6px 4px' }}
                >
                  <Upload size={12} /> Local
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'hf' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hf')}
                  disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  style={{ fontSize: '11px', padding: '6px 4px' }}
                >
                  <Download size={12} /> URL HF
                </button>
              </div>

              {activeTab === 'models' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Modèles pré-configurés et optimisés :
                  </div>
                  {PRESET_MODELS.map((model, idx) => {
                    const isCurrentlyLoaded = loadedModelName === model.url.split('/').pop();
                    return (
                      <div 
                        key={idx} 
                        className="model-card"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          position: 'relative',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', maxWidth: '70%' }}>
                            {model.name.split(' (')[0]}
                          </span>
                          <span 
                            className="status-badge gpu" 
                            style={{ fontSize: '9px', padding: '2px 6px' }}
                          >
                            Kernel Optimisé
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                          {model.desc}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {model.size} • {model.name.match(/\(([^)]+)\)/)?.[1] || 'GGUF'}
                          </span>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                            disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating' || isCurrentlyLoaded}
                            onClick={() => handleLoadModelFromUrl(model.url)}
                          >
                            {isCurrentlyLoaded ? 'Actif' : 'Charger'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div 
                    style={{
                      background: 'rgba(139, 92, 246, 0.05)',
                      border: '1px dashed rgba(139, 92, 246, 0.2)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      marginTop: '6px'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Info size={12} style={{ color: 'var(--accent)' }} /> 
                      Architectures Supportées
                    </div>
                    Nos kernels WGSL optimisent le forward pass des modèles <strong>Qwen (1.5/2/2.5)</strong> et <strong>Llama (3/3.2)</strong>. Les autres modèles GGUF importés via l'onglet <strong>Local</strong> tourneront sur des kernels génériques.
                  </div>
                </div>
              )}

              {activeTab === 'local' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div 
                    className={`file-dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-picker')?.click()}
                  >
                    <Upload className="file-dropzone-icon" size={24} />
                    <span className="file-dropzone-text">Glissez votre modèle GGUF ici</span>
                    <span className="file-dropzone-subtext">ou cliquez pour ouvrir</span>
                    <input 
                      type="file" 
                      id="file-picker" 
                      accept=".gguf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {selectedFile && (
                    <div className="selected-files-list">
                      <div className="file-item">
                        <div className="file-item-info">
                          <Upload size={12} style={{ color: 'var(--accent)' }} />
                          <span className="file-item-name" title={selectedFile.name}>{selectedFile.name}</span>
                          <span className="file-item-size">({formatBytes(selectedFile.size)})</span>
                        </div>
                        <button className="file-remove-btn" onClick={() => setSelectedFile(null)}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="input-group" style={{ marginTop: '8px' }}>
                    <span className="input-label">Vocabulaire / Tokenizer correspondant :</span>
                    <select 
                      className="input-control"
                      value={selectedTokenizerId}
                      onChange={(e) => setSelectedTokenizerId(e.target.value)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      {TOKENIZER_PRESETS.map((t, idx) => (
                        <option key={idx} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    className="btn btn-primary btn-block"
                    onClick={handleLoadLocalModel}
                    disabled={!selectedFile || modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  >
                    <Play size={14} /> Démarrer les Kernels custom
                  </button>
                </div>
              )}

              {activeTab === 'hf' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="input-group">
                    <span className="input-label">Presets disponibles :</span>
                    <select 
                      className="input-control"
                      value={selectedHFModelUrl}
                      onChange={(e) => setSelectedHFModelUrl(e.target.value)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      {PRESET_MODELS.map((model, idx) => (
                        <option key={idx} value={model.url}>
                          {model.name} ({model.size})
                        </option>
                      ))}
                      <option value="custom">Autre (Saisir URL GGUF)</option>
                    </select>
                  </div>

                  {selectedHFModelUrl === 'custom' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="input-group">
                        <span className="input-label">URL GGUF directe :</span>
                        <input 
                          type="text" 
                          className="input-control" 
                          placeholder="https://huggingface.co/..."
                          value={customHFUrl}
                          onChange={(e) => setCustomHFUrl(e.target.value)}
                          disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                        />
                      </div>
                      
                      <div className="input-group">
                        <span className="input-label">Tokenizer :</span>
                        <select 
                          className="input-control"
                          value={selectedTokenizerId}
                          onChange={(e) => setSelectedTokenizerId(e.target.value)}
                          disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                        >
                          {TOKENIZER_PRESETS.map((t, idx) => (
                            <option key={idx} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {selectedHFModelUrl !== 'custom' ? (
                      PRESET_MODELS.find(m => m.url === selectedHFModelUrl)?.desc
                    ) : (
                      "Veuillez entrer une URL directe de téléchargement d'un modèle GGUF de petite taille."
                    )}
                  </div>

                  <button 
                    className="btn btn-primary btn-block"
                    onClick={handleLoadHFModel}
                    disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  >
                    <Download size={14} /> Télécharger & Compiler
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ponytail: execution parameters removed. YAGNI. */}

          {/* Section: Specifications */}
          {modelMetadata && (
            <div className="sidebar-section">
              <div className="section-title">
                <Info size={14} /> spécifications physiques
              </div>
              <div className="card" style={{ padding: '12px' }}>
                <table className="metadata-table">
                  <tbody>
                    <tr>
                      <th>Architecture</th>
                      <td>{modelMetadata.arch}</td>
                    </tr>
                    <tr>
                      <th>Taille d'embd (d)</th>
                      <td>{modelMetadata.config.d}</td>
                    </tr>
                    <tr>
                      <th>Couches Blocks</th>
                      <td>{modelMetadata.config.blockCount}</td>
                    </tr>
                    <tr>
                      <th>Têtes Q / KV</th>
                      <td>{modelMetadata.config.nHeads} / {modelMetadata.config.nKvHeads}</td>
                    </tr>
                    <tr>
                      <th>Fréquence RoPE</th>
                      <td>{modelMetadata.config.ropeTheta}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Eject / Clear Cache */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button 
              className="btn btn-danger btn-block"
              style={{ fontSize: '12px', padding: '8px' }}
              onClick={handleClearCache}
            >
              <Trash2 size={12} /> Nettoyer le cache local
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="chat-area">
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-info">
            {loadedModelName ? (
              <>
                <span className="loaded-model-name" title={loadedModelName}>
                  {loadedModelName.length > 35 ? loadedModelName.slice(0, 35) + '...' : loadedModelName}
                </span>
                <span className="loaded-model-status">
                  <span className={`pulse-dot ${modelState === 'generating' ? 'anim' : ''}`}></span>
                  Moteur WebGPU Actif (WGSL Kernels)
                </span>
              </>
            ) : (
              <>
                <span className="loaded-model-name">Aucun modèle chargé</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configurez la barre latérale</span>
              </>
            )}
          </div>
          {loadedModelName && (
            <button 
              className="btn btn-danger" 
              onClick={handleUnloadModel}
              disabled={modelState === 'generating'}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Décharger
            </button>
          )}
        </header>

        {/* Messages */}
        <div className="messages-container">
          {modelState === 'idle' && (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <Sparkles size={48} strokeWidth={1.5} />
              </div>
              <h2 className="welcome-title">Brimkern · Inférence WebGPU locale</h2>
              <p className="welcome-subtitle">
                Version standalone optimisée exploitant des compute shaders WGSL écrits sur mesure. Vos modèles et calculs s'exécutent entièrement en local sans aucun serveur tiers.
              </p>
              
              <div className="welcome-steps">
                <div className="welcome-step">
                  <div className="welcome-step-num">étape 1</div>
                  <div className="welcome-step-title">Insérez votre GGUF</div>
                  <div className="welcome-step-desc">
                    Glissez-déposez n'importe quel modèle GGUF de petite taille (ex: Qwen 0.5B, Llama 3.2 1B).
                  </div>
                </div>
                
                <div className="welcome-step">
                  <div className="welcome-step-num">étape 2</div>
                  <div className="welcome-step-title">Calculez sur le GPU</div>
                  <div className="welcome-step-desc">
                    Le parser JS extrait les tenseurs et nos kernels WGSL effectuent le forward pass en direct.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', textAlign: 'center', width: '100%' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ou sélectionnez un modèle Hugging Face de test rapide :</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                  {PRESET_MODELS.map((m, idx) => (
                    <button 
                      key={idx}
                      className="btn"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => {
                        setActiveTab('models');
                        handleLoadModelFromUrl(m.url);
                      }}
                    >
                      {m.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(modelState === 'initializing' || modelState === 'loading') && (
            <div className="model-loading-overlay">
              <div className="spinner"></div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{loadingStep}</h3>
              
              {loadingProgress && (
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${loadingProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    <span>{loadingProgress.percentage}%</span>
                    <span>{formatBytes(loadingProgress.loaded)} / {formatBytes(loadingProgress.total)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {modelState === 'error' && (
            <div className="card" style={{ maxWidth: '500px', margin: '40px auto', borderColor: 'var(--error)' }}>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--error)' }}>
                <AlertCircle size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>Erreur matérielle ou de fichier</h3>
                  <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                    {errorMsg}
                  </p>
                  <button 
                    className="btn" 
                    style={{ marginTop: '16px', fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => setModelState('idle')}
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List of messages */}
          {messages.map((msg, index) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="message-bubble">
                  <div style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    display: 'flex', 
                    gap: '4px',
                    opacity: 0.8
                  }} className="message-actions">
                    <button 
                      className="circle-btn" 
                      style={{ width: '24px', height: '24px', padding: 0 }}
                      onClick={() => copyToClipboard(msg.content, index)}
                      title="Copier le message"
                    >
                      {copiedIndex === index ? (
                        <span style={{ color: 'var(--success)', fontSize: '10px' }}>Copié !</span>
                      ) : <Copy size={12} />}
                    </button>
                  </div>
                  
                  <div className="message-text">
                    {renderMessageContent(msg.content)}
                  </div>
                </div>

                {/* Timing statistics */}
                {msg.timings && msg.role === 'assistant' && (
                  <div className="message-stats">
                    <span className="stat-item">
                      <Cpu size={12} /> Prompt : {msg.timings.prompt_speed_ts.toFixed(1)} t/s ({msg.timings.prompt_tokens} t en {msg.timings.prompt_time_ms.toFixed(0)}ms)
                    </span>
                    {msg.timings.decode_speed_ts > 0 && (
                      <span className="stat-item">
                        <Zap size={12} /> Génération : {msg.timings.decode_speed_ts.toFixed(1)} t/s ({msg.timings.decode_tokens} t)
                      </span>
                    )}
                    <span className="stat-item">
                      Total : {(msg.timings.total_time_ms / 1000).toFixed(2)}s
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking animation */}
          {modelState === 'generating' && messages[messages.length - 1]?.content === '' && (
            <div className="message assistant">
              <div className="avatar">
                <Bot size={16} />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions card */}
        {modelState === 'ready' && messages.length <= 1 && (
          <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <div 
                  key={idx} 
                  className="card" 
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  onClick={() => handlePresetPromptClick(item.text)}
                >
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {item.title} <ArrowRight size={12} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    "{item.text.slice(0, 70)}..."
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder={
                modelState === 'ready' 
                  ? "Saisissez votre message..." 
                  : modelState === 'generating'
                    ? "Inférence matricielle WebGPU en cours..."
                    : "Sélectionnez et chargez un modèle dans le menu latéral pour commencer."
              }
              rows={1}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={modelState !== 'ready' && modelState !== 'generating'}
            />
            
            <div className="chat-actions">
              {modelState === 'generating' ? (
                <button 
                  className="circle-btn" 
                  onClick={handleStopGeneration}
                  title="Interrompre les calculs"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                >
                  <Square size={16} fill="currentColor" />
                </button>
              ) : (
                <button 
                  className="circle-btn send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={modelState !== 'ready' || !userInput.trim()}
                  title="Calculer"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Brimkern s'exécute de manière isolée sans transférer vos données à l'extérieur.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
