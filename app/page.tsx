import { Assistant } from "@/features/call/components/assistant";

export default function Home() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl">Welcome to Broadway Show Assistant</h1>
        <p className="text-slate-600">
          Talk with Paula to explore upcoming shows and book tickets.
        </p>
      </div>

      <Assistant />
    </>
  );
}
