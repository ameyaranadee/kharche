"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content: [
    "Hey Ameya! Drop any expense or just paste from your bank statement — I’ll parse, categorize, and log it.",
    "",
    "You can also say things like:",
    '• "$43 at Roberta’s last night, split with Rahul"',
    '• "Netflix $15.49 monthly sub"',
    '• "Paste 5 rows from my BofA CSV"',
  ].join("\n"),
};

const QUICK_ACTIONS = ["quick split", "log rent", "bulk import"];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter((m) => m.role !== "assistant" || m !== WELCOME),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-neutral-900 text-white rounded-br-sm"
                  : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-2.5 text-sm text-neutral-400">
              …
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-100 px-4 py-3">
        <div className="mb-2 flex gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => send(action)}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-50 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 transition-colors"
            placeholder="Type an expense or paste a bank row…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
            disabled={loading}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white disabled:opacity-40 hover:bg-neutral-700 transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
