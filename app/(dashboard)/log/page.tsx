import ChatInterface from "@/components/log/chat-interface";

export default function LogPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 shrink-0">Log expense</h1>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
