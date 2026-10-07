export const TRANSACTION_TYPES = ['transfer', 'deposit', 'withdrawal'] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export const TRANSACTION_STATUSES = ['pending', 'completed', 'failed', 'reversed'] as const
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]
