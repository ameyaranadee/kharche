import ChatWrapper from "./chat-wrapper";

export default function LogPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="flex-1 min-h-0">
        <ChatWrapper />
      </div>
    </div>
  );
}
