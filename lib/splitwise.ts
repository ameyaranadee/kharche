const BASE = "https://secure.splitwise.com/api/v3.0";

async function sw<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.SPLITWISE_API_KEY}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Splitwise ${res.status}: ${text}`);
  }
  return res.json();
}

export interface SwUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface SwBalance {
  currency_code: string;
  amount: string;
}

export interface SwFriend {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  balance: SwBalance[];
}

export interface SwDebt {
  from: number;
  to: number;
  amount: string;
  currency_code: string;
}

export interface SwGroup {
  id: number;
  name: string;
  simplified_debts: SwDebt[];
  members: SwUser[];
}

export async function getCurrentUser(): Promise<SwUser> {
  const data = await sw<{ user: SwUser }>("/get_current_user");
  return data.user;
}

export async function getFriends(): Promise<SwFriend[]> {
  const data = await sw<{ friends: SwFriend[] }>("/get_friends");
  return data.friends ?? [];
}

export async function createExpense(params: {
  cost: string;
  description: string;
  date: string;
  currency_code?: string;
  group_id?: number;
  users: Array<{
    user_id: number;
    paid_share: string;
    owed_share: string;
  }>;
}): Promise<{ expense: { id: number } }> {
  const body: Record<string, unknown> = {
    cost: params.cost,
    description: params.description,
    date: params.date,
    currency_code: params.currency_code ?? "USD",
    split_equally: false,
  };
  if (params.group_id) body.group_id = params.group_id;
  params.users.forEach((u, i) => {
    body[`users__${i}__user_id`] = u.user_id;
    body[`users__${i}__paid_share`] = u.paid_share;
    body[`users__${i}__owed_share`] = u.owed_share;
  });
  return sw<{ expense: { id: number } }>("/create_expense", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
