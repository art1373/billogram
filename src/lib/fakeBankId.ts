/**
 * Fake BankID API — always resolves to `complete` after a simulated polling cycle.
 *
 * Mirrors the real BankID REST API shape so it can be swapped for a real
 * implementation without touching call-sites:
 *
 *   startAuth()           → { orderRef, autoStartToken, … }
 *   collect(orderRef)     → { status: 'pending' | 'complete' | 'failed', … }
 *   cancel(orderRef)      → void
 *
 * Polling sequence (call 1 → 2 → 3):
 *   pending / outstandingTransaction  (app not yet opened)
 *   pending / userSign                (user is signing)
 *   complete                          (✓)
 */

const START_DELAY_MS = 800;
const COLLECT_DELAY_MS = 1_600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type BankIdStatus = "pending" | "complete" | "failed";

export type PendingHintCode =
  | "outstandingTransaction"
  | "noClient"
  | "started"
  | "userSign";

export type FailedHintCode =
  | "cancelled"
  | "startFailed"
  | "userCancel"
  | "expiredTransaction";

export interface StartAuthResponse {
  orderRef: string;
  autoStartToken: string;
  qrStartToken: string;
  qrStartSecret: string;
}

export interface CompletionData {
  user: {
    name: string;
    personalNumber: string;
    givenName: string;
    surname: string;
  };
}

export type CollectResponse =
  | { orderRef: string; status: "pending"; hintCode: PendingHintCode }
  | { orderRef: string; status: "complete"; completionData: CompletionData }
  | { orderRef: string; status: "failed"; hintCode: FailedHintCode };

// ─── Human-readable hint messages ─────────────────────────────────────────────

export const hintMessages: Record<PendingHintCode | FailedHintCode, string> = {
  outstandingTransaction: "Open BankID on this device.",
  noClient: "BankID app not found. Start the app and try again.",
  started: "Searching for BankID…",
  userSign: "Confirm your identity in the BankID app.",
  cancelled: "The action was cancelled.",
  startFailed: "BankID could not be started. Try again.",
  userCancel: "You cancelled the BankID authentication.",
  expiredTransaction: "The BankID session has expired. Try again.",
};

// ─── Internal state ───────────────────────────────────────────────────────────

/** Tracks how many times collect() has been called for each orderRef. */
const collectCounters = new Map<string, number>();

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Initiate a BankID authentication order.
 * Resolves after a simulated network delay (~800 ms).
 */
export async function startAuth(): Promise<StartAuthResponse> {
  await sleep(START_DELAY_MS);
  return {
    orderRef: generateToken(),
    autoStartToken: generateToken(),
    qrStartToken: generateToken(),
    qrStartSecret: generateToken(),
  };
}

/**
 * Collect the current status of an ongoing BankID order.
 * Simulates a ~1.6 s network round-trip per call.
 *
 * Call sequence for a given orderRef:
 *   1st call → pending / outstandingTransaction
 *   2nd call → pending / userSign
 *   3rd call → complete
 */
export async function collect(orderRef: string): Promise<CollectResponse> {
  await sleep(COLLECT_DELAY_MS);

  const count = (collectCounters.get(orderRef) ?? 0) + 1;
  collectCounters.set(orderRef, count);

  if (count === 1) {
    return { orderRef, status: "pending", hintCode: "outstandingTransaction" };
  }

  if (count === 2) {
    return { orderRef, status: "pending", hintCode: "userSign" };
  }

  // 3rd call → success
  collectCounters.delete(orderRef);
  return {
    orderRef,
    status: "complete",
    completionData: {
      user: {
        name: "Anna Svensson",
        personalNumber: "19900101-1234",
        givenName: "Anna",
        surname: "Svensson",
      },
    },
  };
}

/**
 * Cancel an ongoing BankID order.
 */
export async function cancel(orderRef: string): Promise<void> {
  await sleep(200);
  collectCounters.delete(orderRef);
}
// Purely written by AI 🤖
