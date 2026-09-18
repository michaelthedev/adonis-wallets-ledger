// import User from "#models/user";
import Wallet from "#models/wallet";
import type {TransactionClientContract} from "@adonisjs/lucid/types/database";
import db from "@adonisjs/lucid/services/db";

export default class WalletService {
  async createDefault(userId: number, trx?: TransactionClientContract) {
    const defaultCurrencies = ['NGN', 'USD'];

    for (const currency of defaultCurrencies) {
      await Wallet.create({userId, currency}, trx ? { client: trx } : undefined)
    }
  }

  async findOrCreate(userId: number, currency: string, trx?: TransactionClientContract) {
    const opts = trx ? { client: trx } : undefined

    const existing = await Wallet.query(opts ?? {})
      .where('user_id', userId)
      .where('currency', currency)
      .first()

    try {
      return existing ?? await Wallet.create({userId, currency}, opts)
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        return await Wallet.query(opts ?? {})
          .where('user_id', userId)
          .where('currency', currency)
          .firstOrFail()
      }

      throw e
    }
  }

  async lockFor(userId: number, currency: string, trx: TransactionClientContract) {
    return Wallet.query({ client: trx })
      .where('user_id', userId)
      .where('currency', currency)
      .forUpdate()
      .firstOrFail()
  }

  async listWithBalance(userId: number) {
    const wallets = await Wallet.query()
      .where('user_id', userId)
      .withAggregate('ledgerEntries', (q) =>
        q.sum(db.raw(`CASE WHEN direction = 'credit' THEN amount ELSE -amount END`)).as('balance')
      )

    return wallets.map((wallet) => ({
      id: wallet.id,
      currency: wallet.currency,
      balance: Number(wallet.$extras.balance ?? 0),
    }));
  }
}
