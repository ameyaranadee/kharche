"use client";

import dynamic from "next/dynamic";

const ChatInterface = dynamic(
  () => import("@/components/log/chat-interface"),
  { ssr: false }
);

export default function ChatWrapper() {
  return <ChatInterface />;
}
