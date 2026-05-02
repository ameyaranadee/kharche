import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { insertTransaction, insertSplit, insertSubscription } from "@/lib/db";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Kharche, a personal finance assistant. You help the user log expenses, split bills, and track subscriptions.

When the user describes a transaction or pastes bank statement rows, extract the details and call the appropriate tool:
- Use log_transaction for any expense or income
- Use create_split when the user mentions splitting a bill with someone
- Use tag_subscription when the transaction looks like a recurring subscription

Respond conversationally and confirm what you logged. If splitting, ask if they want to add it to Splitwise. Keep responses short and friendly.

Supported CSV formats: BofA (Date,Description,Amount,Running Bal.) and Discover (Trans. Date,Post Date,Description,Amount,Category).`;

const tools: Anthropic.Tool[] = [
  {
    name: "log_transaction",
    description: "Log a financial transaction (expense or income)",
    input_schema: {
      type: "object" as const,
      properties: {
        merchant: { type: "string", description: "Merchant or payee name" },
        amount: { type: "number", description: "Amount (negative for expense, positive for income)" },
        date: { type: "string", description: "Date in YYYY-MM-DD format" },
        category: {
          type: "string",
          enum: ["Dining", "Groceries", "Transport", "Entertainment", "Shopping", "Utilities", "Subscriptions", "Income", "Rent", "Healthcare", "Travel", "Other"],
          description: "Transaction category",
        },
        notes: { type: "string", description: "Optional notes" },
      },
      required: ["merchant", "amount", "date", "category"],
    },
  },
  {
    name: "create_split",
    description: "Log a transaction and create a bill split with another person",
    input_schema: {
      type: "object" as const,
      properties: {
        merchant: { type: "string" },
        total_amount: { type: "number", description: "Total bill amount (positive)" },
        split_amount: { type: "number", description: "Amount owed by or to the other person" },
        with_person: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        you_paid: { type: "boolean", description: "True if you paid the full bill" },
        category: { type: "string", enum: ["Dining", "Groceries", "Transport", "Entertainment", "Shopping", "Travel", "Other"] },
      },
      required: ["merchant", "total_amount", "split_amount", "with_person", "date", "you_paid", "category"],
    },
  },
  {
    name: "tag_subscription",
    description: "Tag a transaction as a recurring subscription",
    input_schema: {
      type: "object" as const,
      properties: {
        merchant: { type: "string" },
        amount: { type: "number", description: "Monthly/yearly amount (positive)" },
        cycle: { type: "string", enum: ["monthly", "yearly", "weekly"] },
        next_renewal_date: { type: "string", description: "YYYY-MM-DD" },
      },
      required: ["merchant", "amount", "cycle", "next_renewal_date"],
    },
  },
];

async function executeToolCall(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    if (name === "log_transaction") {
      const { merchant, amount, date, category, notes } = input as {
        merchant: string; amount: number; date: string; category: string; notes?: string;
      };
      await insertTransaction({ merchant, amount, date, category, notes, source: "chat" });
      const sign = amount > 0 ? "+" : "-";
      return JSON.stringify({ success: true, message: `Logged: ${merchant} ${sign}$${Math.abs(amount)} on ${date}` });
    }

    if (name === "create_split") {
      const { merchant, total_amount, split_amount, with_person, date, you_paid, category } = input as {
        merchant: string; total_amount: number; split_amount: number;
        with_person: string; date: string; you_paid: boolean; category: string;
      };
      const myAmount = you_paid ? -(total_amount - split_amount) : -split_amount;
      const txn = await insertTransaction({ merchant, amount: myAmount, date, category, source: "chat" });
      await insertSplit({ txn_id: txn.id, with_person, owed: split_amount });
      const direction = you_paid ? `${with_person} owes you` : `you owe ${with_person}`;
      return JSON.stringify({ success: true, message: `Split logged: ${merchant} — ${direction} $${split_amount.toFixed(2)}` });
    }

    if (name === "tag_subscription") {
      const { merchant, amount, cycle, next_renewal_date } = input as {
        merchant: string; amount: number; cycle: string; next_renewal_date: string;
      };
      const txn = await insertTransaction({
        merchant, amount: -amount, date: new Date().toISOString().slice(0, 10),
        category: "Subscriptions", source: "chat",
      });
      await insertSubscription({ merchant, amount, cycle, next_renewal_date, linked_txn_id: txn.id });
      return JSON.stringify({ success: true, message: `Subscription tagged: ${merchant} $${amount}/${cycle}` });
    }

    return JSON.stringify({ success: false, message: "Unknown tool" });
  } catch (err) {
    console.error(`Tool ${name} error:`, err);
    return JSON.stringify({ success: false, message: "Failed to save. Please try again." });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Anthropic.MessageParam[] };
    if (!messages?.length) {
      return NextResponse.json({ reply: "No message provided." }, { status: 400 });
    }

    let currentMessages: Anthropic.MessageParam[] = messages;
    let finalReply = "";

    for (let i = 0; i < 5; i++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools,
        messages: currentMessages,
      });

      if (response.stop_reason === "end_turn") {
        const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
        finalReply = textBlock?.text ?? "Done!";
        break;
      }

      if (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
        );
        currentMessages = [...currentMessages, { role: "assistant", content: response.content }];

        const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
          toolUseBlocks.map(async (block) => ({
            type: "tool_result" as const,
            tool_use_id: block.id,
            content: await executeToolCall(block.name, block.input as Record<string, unknown>),
          }))
        );

        currentMessages = [...currentMessages, { role: "user", content: toolResults }];
        continue;
      }

      break;
    }

    return NextResponse.json({ reply: finalReply || "Got it!" });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ reply: "Something went wrong." }, { status: 500 });
  }
}
