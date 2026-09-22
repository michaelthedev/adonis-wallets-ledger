import User from '#models/user'
import Wallet from '#models/wallet'
import Transaction from '#models/transaction'
import LedgerEntry from '#models/ledger_entry'
import WalletService from '#services/wallet_service'
import { DateTime } from 'luxon'

let counter = 0

export interface CreateUserOptions {
  withWallets?: boolean
}

/**
 * Creates a user with unique defaults.
 *
 * @example
 * const user = await createUser()
 * const userWithWallets = await createUser({}, { withWallets: true })
 * const customUser = await createUser({ email: 'custom@test.com' })
 */
export async function createUser(
  attributes: Partial<{
    firstName: string
    lastName: string
    email: string
    password: string
  }> = {},
  options: CreateUserOptions = {}
) {
  counter++
  const user = await User.create({
    firstName: 'John',
    lastName: `Doe${counter}`,
    email: `test_user_${Date.now()}_${counter}@example.com`,
    password: 'password123',
    ...attributes,
  })

  if (options.withWallets) {
    const walletService = new WalletService()
    await walletService.createDefault(user.id)
  }

  return user
}

/**
 * Creates or gets a wallet for a user.
 *
 * @example
 * const wallet = await createWallet(user, 'USD')
 */
export async function createWallet(user: User, currency = 'USD') {
  return await Wallet.firstOrCreate(
    { userId: user.id, currency },
    { userId: user.id, currency }
  )
}

/**
 * Funds a wallet by creating a completed transaction and a credit ledger entry.
 *
 * @example
 * const { wallet, transaction, ledgerEntry } = await fundWallet(wallet, 500)
 */
export async function fundWallet(
  wallet: Wallet,
  amount: number,
  currency?: string
) {
  const transaction = await Transaction.create({
    type: 'deposit',
    status: 'completed',
    completedAt: DateTime.now(),
  })

  const ledgerEntry = await LedgerEntry.create({
    walletId: wallet.id,
    transactionId: transaction.id,
    amount,
    currency: currency ?? wallet.currency,
    direction: 'credit',
  })

  return { wallet, transaction, ledgerEntry }
}

/**
 * Creates a user with an active wallet with initial balance.
 *
 * @example
 * const { user, wallet } = await createUserWithBalance(1000, 'USD')
 */
export async function createUserWithBalance(
  amount: number,
  currency = 'USD',
  userAttributes: Parameters<typeof createUser>[0] = {}
) {
  const user = await createUser(userAttributes)
  const wallet = await createWallet(user, currency)
  await fundWallet(wallet, amount, currency)

  return { user, wallet }
}
