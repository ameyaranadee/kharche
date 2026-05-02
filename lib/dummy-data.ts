import { Transaction, MonthlyData, Subscription } from './types'

export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-05-01',
    merchant: 'Whole Foods',
    amount: -87.40,
    category: 'Groceries',
    source: 'bofa',
    created_at: '2025-05-01T10:00:00Z',
  },
  {
    id: '2',
    date: '2025-04-30',
    merchant: "Roberta's Pizza",
    amount: -43.00,
    category: 'Dining',
    source: 'discover',
    created_at: '2025-04-30T20:00:00Z',
  },
  {
    id: '3',
    date: '2025-04-28',
    merchant: 'Freelance — Acme Co',
    amount: 1200.00,
    category: 'Income',
    source: 'manual',
    created_at: '2025-04-28T09:00:00Z',
  },
  {
    id: '4',
    date: '2025-04-27',
    merchant: 'MTA MetroCard',
    amount: -33.00,
    category: 'Transport',
    source: 'bofa',
    created_at: '2025-04-27T08:00:00Z',
  },
  {
    id: '5',
    date: '2025-04-25',
    merchant: 'Netflix',
    amount: -15.49,
    category: 'Subscriptions',
    source: 'discover',
    created_at: '2025-04-25T00:00:00Z',
  },
]

export const dummyMonthlyData: MonthlyData[] = [
  { month: 'Dec', income: 5800, expenses: 3200 },
  { month: 'Jan', income: 6000, expenses: 3500 },
  { month: 'Feb', income: 5500, expenses: 3100 },
  { month: 'Mar', income: 6400, expenses: 3700 },
  { month: 'Apr', income: 5900, expenses: 3600 },
  { month: 'May', income: 6200, expenses: 3840 },
]

export const dummySubscriptions: Subscription[] = [
  {
    id: '1',
    merchant: 'YouTube Premium',
    amount: 13.99,
    cycle: 'monthly',
    next_renewal_date: '2025-05-05',
    active: true,
  },
  {
    id: '2',
    merchant: 'Spotify',
    amount: 10.99,
    cycle: 'monthly',
    next_renewal_date: '2025-05-12',
    active: true,
  },
  {
    id: '3',
    merchant: 'Netflix',
    amount: 15.49,
    cycle: 'monthly',
    next_renewal_date: '2025-05-18',
    active: true,
  },
  {
    id: '4',
    merchant: 'Linear',
    amount: 8.00,
    cycle: 'monthly',
    next_renewal_date: '2025-05-22',
    active: true,
  },
  {
    id: '5',
    merchant: 'ChatGPT Plus',
    amount: 20.00,
    cycle: 'monthly',
    next_renewal_date: '2025-05-28',
    active: true,
  },
]

export const dummySplitwise = {
  youOwe: [
    {
      id: '1',
      person: 'Rahul K',
      initials: 'RK',
      description: 'Dinner at Lure Fishbar',
      date: 'Apr 29',
      amount: -34.00,
      color: '#a8d8c8',
    },
    {
      id: '2',
      person: 'Nisha P',
      initials: 'NP',
      description: 'Airbnb Montauk',
      date: 'Apr 15',
      amount: -187.50,
      color: '#b8d4f0',
    },
  ],
  owedToYou: [
    {
      id: '3',
      person: 'Arjun V',
      initials: 'AV',
      description: 'Groceries',
      date: 'Apr 22',
      amount: 28.75,
      color: '#f0d4a8',
    },
  ],
}
