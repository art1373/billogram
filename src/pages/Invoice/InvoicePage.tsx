import { Header } from "../../components/Header/Header";
import { BankIDBox } from "./components/BankIDBox/BankIDBox";

export function InvoicePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-start justify-center p-6 pt-20">
        <div className="w-full max-w-sm mt-[25vh]">
          <BankIDBox />
        </div>
      </main>
    </>
  );
}
