"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface LoggedEntry {
  merchant: string;
  amount: number;
  date: string;
  category: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  logged?: LoggedEntry;
}

const WELCOME: Message = {
  role: "assistant",
  content: [
    "Hey Ameya! Drop any expense or just paste from your bank statement. I'll parse, categorize, and log it.",
    "",
    "You can also say things like:",
    '• "$43 at Roberta last night, split with Rahul"',
    '• "Netflix $15.49 monthly sub"',
    '• "Paste 5 rows from my BofA CSV"',
  ].join("\n"),
};

const QUICK_ACTIONS = ["quick split", "log rent", "bulk import"];

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TransactionCard({ logged }: { logged: LoggedEntry }) {
  const isExpense = logged.amount < 0;
  const formatted = `${isExpense ? "-" : "+"}$${Math.abs(logged.amount).toFixed(2)}`;

  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <Check size={14} className="text-emerald-600" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900">
          {logged.merchant}
        </p>
        <p className="text-xs text-neutral-400">
          {logged.category} · {formatDate(logged.date)}
        </p>
      </div>
      <span
        className={`text-sm font-semibold tabular-nums ${isExpense ? "text-red-500" : "text-emerald-600"}`}
      >
        {formatted}
      </span>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem("chat_history");
      return saved ? (JSON.parse(saved) as Message[]) : [WELCOME];
    } catch {
      return [WELCOME];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

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
          messages: [...messages, userMsg]
            .filter((m) => m.role !== "assistant" || m !== WELCOME)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          logged: data.logged ?? undefined,
        },
      ]);
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
              className={`max-w-sm ${msg.role === "user" ? "w-auto" : "w-full"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-neutral-900 text-white rounded-br-sm whitespace-pre-wrap"
                    : "bg-neutral-100 text-neutral-800 rounded-bl-sm prose prose-sm prose-neutral max-w-none"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
              {msg.logged && <TransactionCard logged={msg.logged} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
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
