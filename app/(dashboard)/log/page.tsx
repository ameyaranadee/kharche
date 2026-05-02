import ChatInterface from "@/components/log/chat-interface";

export default function LogPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 3.5rem - 4rem)" }}>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
