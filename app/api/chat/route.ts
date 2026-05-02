import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

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
    description: "Create a bill split with another person",
    input_schema: {
      type: "object" as const,
      properties: {
        merchant: { type: "string", description: "Where the expense was" },
        total_amount: { type: "number", description: "Total bill amount (positive)" },
        split_amount: { type: "number", description: "Amount owed by or to the other person" },
        with_person: { type: "string", description: "Name of the person you split with" },
        date: { type: "string", description: "Date in YYYY-MM-DD format" },
        you_paid: { type: "boolean", description: "True if you paid the bill, false if they paid" },
      },
      required: ["merchant", "total_amount", "split_amount", "with_person", "date", "you_paid"],
    },
  },
  {
    name: "tag_subscription",
    description: "Tag a transaction as a recurring subscription",
    input_schema: {
      type: "object" as const,
      properties: {
        merchant: { type: "string", description: "Subscription service name" },
        amount: { type: "number", description: "Monthly/yearly amount (positive)" },
        cycle: { type: "string", enum: ["monthly", "yearly", "weekly"], description: "Billing cycle" },
        next_renewal_date: { type: "string", description: "Next renewal date in YYYY-MM-DD format" },
      },
      required: ["merchant", "amount", "cycle", "next_renewal_date"],
    },
  },
];

function executeToolCall(name: string, input: Record<string, unknown>): string {
  if (name === "log_transaction") {
    const { merchant, amount, date, category, notes } = input as {
      merchant: string; amount: number; date: string; category: string; notes?: string;
    };
    const sign = amount > 0 ? "+" : "";
    return JSON.stringify({
      success: true,
      message: `Logged: ${merchant} ${sign}$${Math.abs(amount)} on ${date} (${category})${notes ? ` — ${notes}` : ""}`,
    });
  }
  if (name === "create_split") {
    const { merchant, split_amount, with_person, you_paid } = input as {
      merchant: string; split_amount: number; with_person: string; you_paid: boolean;
    };
    const direction = you_paid ? `${with_person} owes you` : `you owe ${with_person}`;
    return JSON.stringify({
      success: true,
      message: `Split created: ${merchant} — ${direction} $${split_amount.toFixed(2)}`,
    });
  }
  if (name === "tag_subscription") {
    const { merchant, amount, cycle } = input as {
      merchant: string; amount: number; cycle: string;
    };
    return JSON.stringify({
      success: true,
      message: `Tagged ${merchant} as a ${cycle} subscription at $${amount}/month`,
    });
  }
  return JSON.stringify({ success: false, message: "Unknown tool" });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: Anthropic.MessageParam[];
    };

    const userMessages = messages.filter((m) => m.role === "user");
    if (!userMessages.length) {
      return NextResponse.json({ reply: "No message provided." }, { status: 400 });
    }

    let currentMessages: Anthropic.MessageParam[] = messages;
    let finalReply = "";

    // Agentic loop — handle tool calls until end_turn
    for (let i = 0; i < 5; i++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
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

        currentMessages = [
          ...currentMessages,
          { role: "assistant", content: response.content },
        ];

        const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((block) => ({
          type: "tool_result",
          tool_use_id: block.id,
          content: executeToolCall(block.name, block.input as Record<string, unknown>),
        }));

        currentMessages = [
          ...currentMessages,
          { role: "user", content: toolResults },
        ];
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
