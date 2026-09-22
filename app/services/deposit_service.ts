import WalletService from "#services/wallet_service";
import {inject} from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import Transaction from "#models/transaction";
import LedgerEntry from "#models/ledger_entry";
import {DateTime} from "luxon";
import app from '@adonisjs/core/services/app'

@inject()
export class DepositService {
  constructor(private walletService: WalletService) {}

  async init(userId: number, amount: number, currency: string) {
    if (! app.inDev) throw new Error("This is a demo project, do not use in production")

    return db.transaction(async (trx) => {
      const wallet = await this.walletService.findOrCreate(userId, currency, trx);

      const transaction = await Transaction.create(
          { type: 'deposit', status: 'pending' },
          { client: trx }
      )

      await LedgerEntry.create({
        amount,
        currency,
        direction: 'credit',
        walletId: wallet.id,
        transactionId: transaction.id,
      }, { client: trx })

      // update transaction
      transaction.status = 'completed'
      transaction.completedAt = DateTime.now()
      await transaction.save();

      return transaction;
    })
  }
}
