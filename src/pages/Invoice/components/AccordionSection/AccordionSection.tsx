import { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  CircleCheck,
  CircleX,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { Accordion } from "./Accordion/Accordion";
import { Button } from "../../../../components/Button/Button";
import { InfoItem } from "./InfoItem/InfoItem";
import type { AccordionSectionProps } from "./AccordionSection.types";
import {
  cancel,
  collect,
  hintMessages,
  startAuth,
} from "../../../../lib/fakeBankId";
import type {
  FailedHintCode,
  PendingHintCode,
} from "../../../../lib/fakeBankId";

const linkValueForTracking =
  "https://www.billogram.com/sv/blogg/varldens-basta-enkla-betalning";

type FlowState = "idle" | "loading" | "complete" | "failed";

export function AccordionSection({
  defaultOpen = true,
}: AccordionSectionProps) {
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [completionName, setCompletionName] = useState<string>("");

  const orderRefRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);

  const statusRef = useRef<HTMLParagraphElement>(null);
  const completeRef = useRef<HTMLParagraphElement>(null);
  const failedRef = useRef<HTMLParagraphElement>(null);

  const isLoading = flowState === "loading";

  useEffect(() => {
    if (flowState === "loading" && statusMessage) {
      statusRef.current?.focus();
    } else if (flowState === "complete") {
      completeRef.current?.focus();
    } else if (flowState === "failed") {
      failedRef.current?.focus();
    }
  }, [flowState, statusMessage]);

  async function runBankIdFlow() {
    setFlowState("loading");
    setStatusMessage("Starting BankID…");
    cancelledRef.current = false;

    const { orderRef } = await startAuth();
    orderRefRef.current = orderRef;

    if (cancelledRef.current) return;

    let done = false;
    while (!done && !cancelledRef.current) {
      const res = await collect(orderRef);

      if (res.status === "pending") {
        setStatusMessage(hintMessages[res.hintCode as PendingHintCode]);
      } else if (res.status === "complete") {
        setCompletionName(res.completionData.user.givenName);
        setFlowState("complete");
        done = true;
      } else {
        setStatusMessage(hintMessages[res.hintCode as FailedHintCode]);
        setFlowState("failed");
        done = true;
      }
    }
  }

  async function handleCancel() {
    cancelledRef.current = true;
    if (orderRefRef.current) {
      await cancel(orderRefRef.current);
      orderRefRef.current = null;
    }
    setFlowState("idle");
    setStatusMessage("");
  }

  function reset() {
    setFlowState("idle");
    setStatusMessage("");
    setCompletionName("");
    orderRefRef.current = null;
  }

  return (
    <Accordion defaultOpen={defaultOpen} isLoading={isLoading}>
      <Accordion.Trigger icon={<ChevronUp size={16} strokeWidth={2} />}>
        Betala och koppla bankkonto
      </Accordion.Trigger>

      <Accordion.Content>
        {(flowState === "idle" || flowState === "loading") && (
          <>
            <ul className="mb-5 list-none space-y-1 p-0" aria-label="Benefits">
              <InfoItem
                icon={
                  <Rocket size={20} className="text-(--color-icon-payment)" />
                }
                text="Snabbare betalning av framtida fakturor."
              />
              <InfoItem
                icon={
                  <ShieldCheck
                    size={20}
                    className="text-(--color-icon-trust)"
                  />
                }
                text="Säker koppling till din bank."
                link={{ href: linkValueForTracking, label: "Läs mer" }}
              />
            </ul>

            {isLoading && (
              <p
                ref={statusRef}
                aria-live="polite"
                tabIndex={-1}
                className="mb-4 text-sm text-gray-500 dark:text-gray-400 focus:outline-none"
              >
                {statusMessage}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                disabled={isLoading}
                onClick={runBankIdFlow}
              >
                Start mobile BankID
              </Button>
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={runBankIdFlow}
              >
                Mobile BankID on other device
              </Button>

              {isLoading && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mt-1 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}

        {flowState === "complete" && (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <CircleCheck
              size={40}
              className="text-green-500"
              strokeWidth={1.5}
            />
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              Welcome, {completionName}!
            </p>
            <p
              ref={completeRef}
              tabIndex={-1}
              className="text-sm text-gray-500 dark:text-gray-400 focus:outline-none"
            >
              Your bank account has been linked successfully.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              Start over
            </button>
          </div>
        )}

        {flowState === "failed" && (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <CircleX size={40} className="text-red-400" strokeWidth={1.5} />
            <p
              ref={failedRef}
              tabIndex={-1}
              className="text-sm text-gray-500 dark:text-gray-400 focus:outline-none"
            >
              {statusMessage}
            </p>
            <Button variant="secondary" onClick={reset}>
              Try again
            </Button>
          </div>
        )}
      </Accordion.Content>
    </Accordion>
  );
}
