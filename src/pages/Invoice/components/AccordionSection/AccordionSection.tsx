import { ChevronUp, Rocket, ShieldCheck } from "lucide-react";
import { Accordion } from "./Accordion/Accordion";
import { Button } from "../../../../components/Button/Button";
import { InfoItem } from "./InfoItem/InfoItem";
import type { AccordionSectionProps } from "./AccordionSection.types";

const linkValueForTracking =
  "https://www.billogram.com/sv/blogg/varldens-basta-enkla-betalning";

export function AccordionSection({
  defaultOpen = true,
  onStartMobileBankId,
  onOtherDevice,
}: AccordionSectionProps) {
  return (
    <Accordion defaultOpen={defaultOpen}>
      <Accordion.Trigger icon={<ChevronUp size={16} strokeWidth={2} />}>
        Betala och koppla bankkonto
      </Accordion.Trigger>
      <Accordion.Content>
        <ul className="mb-5 list-none space-y-1 p-0" aria-label="Benefits">
          <InfoItem
            icon={<Rocket size={20} className="text-blue-500" />}
            text="Snabbare betalning av framtida fakturor."
          />
          <InfoItem
            icon={<ShieldCheck size={20} className="text-green-600" />}
            text="Säker koppling till din bank."
            link={{ href: linkValueForTracking, label: "Läs mer" }}
          />
        </ul>

        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={onStartMobileBankId}>
            Start mobile BankID
          </Button>
          <Button variant="secondary" onClick={onOtherDevice}>
            Mobile BankID on other device
          </Button>
        </div>
      </Accordion.Content>
    </Accordion>
  );
}
