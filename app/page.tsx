import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-4xl font-bold leading-tight">
              Hello World! by Vercel
          </h1>
          <Link href="/auth" className="text-2xl font-semibold leading-tight">to new users page</Link>
          <div className="flex flex-col gap-8">
              <Button className="bg-gradient-to-r from-green-700 to-green-300 text-white p-4">
                  Pharmacy
              </Button>
          </div>
      </main>
    </div>
  );
}
