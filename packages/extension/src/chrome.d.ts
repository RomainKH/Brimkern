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
    const onInstalled: { addListener(cb: () => void): void };
    const onStartup: { addListener(cb: () => void): void };
    const onMessage: {
      addListener(cb: (msg: any, sender: unknown, reply: (r: unknown) => void) => boolean | void): void;
    };
  }
  namespace storage {
    const local: {
      get(keys: string | string[]): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
    };
  }
  namespace i18n {
    function getUILanguage(): string;
  }
  namespace declarativeNetRequest {
    function updateEnabledRulesets(opts: { enableRulesetIds?: string[]; disableRulesetIds?: string[] }): Promise<void>;
    function getEnabledRulesets(): Promise<string[]>;
  }
  namespace sidePanel {
    function open(opts: { windowId?: number; tabId?: number }): Promise<void>;
  }
  namespace contextMenus {
    function removeAll(): Promise<void>;
    function create(opts: { id: string; title: string; contexts: string[] }): void;
    const onClicked: { addListener(cb: (info: { menuItemId: string | number; selectionText?: string }, tab?: { id?: number; windowId?: number }) => void): void };
  }
  namespace tabs {
    function query(q: { active?: boolean; currentWindow?: boolean }): Promise<Array<{ id?: number; windowId?: number; title?: string; url?: string }>>;
  }
  namespace scripting {
    function executeScript<T = any>(opts: { target: { tabId: number }; func: () => T }): Promise<Array<{ result: T }>>;
  }
  namespace offscreen {
    function createDocument(p: { url: string; reasons: string[]; justification: string }): Promise<void>;
    function closeDocument(): Promise<void>;
    function hasDocument(): Promise<boolean>;
  }
}
