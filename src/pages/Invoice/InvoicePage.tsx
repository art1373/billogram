import { Header } from "../../components/Header/Header";
import { AccordionSection } from "./components/AccordionSection/AccordionSection";

export function InvoicePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-start justify-center p-6 pt-20">
        <div className="w-full max-w-sm mt-[25vh]">
          <AccordionSection />
        </div>
      </main>
    </>
  );
}
