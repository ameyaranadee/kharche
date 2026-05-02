export interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  category: string
  source: string
  raw_description?: string
  notes?: string
  created_at: string
}

export interface Split {
  id: string
  txn_id: string
  with_person: string
  owed: number
  settled: boolean
  splitwise_id?: string
}

export interface Subscription {
  id: string
  merchant: string
  amount: number
  cycle: 'monthly' | 'yearly' | 'weekly'
  next_renewal_date: string
  linked_txn_id?: string
  active: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
