// Globally-unique message id. Shared by the page (new messages) and useConversations (re-stamping
// restored messages) so ids never collide — including with conversations persisted before this existed,
// whose old "m0/m1" ids (sometimes duplicated by an earlier bug) are reassigned on load.
let _seq = 0;
export const nextMsgId = (): string =>
  (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `m${_seq++}-${Math.random().toString(36).slice(2)}`;
