// Le sous-ensemble de l'API `chrome.*` dont l'extension se sert — déclaré ici plutôt que de tirer
// @types/chrome (des milliers de lignes) pour une dizaine d'appels.

declare namespace chrome {
  namespace runtime {
    interface Port {
      name: string;
      postMessage(msg: unknown): void;
      disconnect(): void;
      onMessage: { addListener(cb: (msg: any, port: Port) => void): void };
      onDisconnect: { addListener(cb: (port: Port) => void): void };
    }
    const lastError: { message?: string } | undefined;
    function connect(info: { name: string }): Port;
    function sendMessage(msg: unknown): Promise<any>;
    function getURL(path: string): string;
    function openOptionsPage(): Promise<void>;
    const onConnect: { addListener(cb: (port: Port) => void): void };
    const onMessage: {
      addListener(cb: (msg: any, sender: unknown, reply: (r: unknown) => void) => boolean | void): void;
    };
  }
  namespace storage {
    const local: {
      get(keys: string | string[]): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
    };
  }
  namespace i18n {
    function getUILanguage(): string;
  }
  namespace offscreen {
    function createDocument(p: { url: string; reasons: string[]; justification: string }): Promise<void>;
    function closeDocument(): Promise<void>;
    function hasDocument(): Promise<boolean>;
  }
}
