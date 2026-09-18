import db from "@adonisjs/lucid/services/db";
import User from "#models/user";
import Wallet from "#models/wallet";
import Transaction from "#models/transaction";
import LedgerEntry from "#models/ledger_entry";
import {DateTime} from "luxon";
import type {TransactionClientContract} from "@adonisjs/lucid/types/database";
import {inject} from "@adonisjs/core";
import WalletService from "#services/wallet_service";

@inject()
export default class TransferService {
  private walletService: WalletService;

  constructor(walletService: WalletService) {
    this.walletService = walletService
  }

  async init(
    senderUserId: number,
    receiver: string,
    amount: number,
    currency: string
  ) {
    return db.transaction(async (trx) => {
      const senderWallet = await Wallet.query({ client: trx })
        .where('user_id', senderUserId)
        .where('currency', currency)
        .forUpdate()
        .firstOrFail()

      //@todo: change to like username so this wont be used to confirm an email exists
      const receiverUser = await User.query({ client: trx })
        .where('email', receiver)
        .firstOrFail()

      // block same user
      if (senderUserId === receiverUser.id) {
        throw new Error('You cannot transfer to yourself')
      }

      let receiverWallet = await this.walletService
        .findOrCreate(receiverUser.id, currency, trx);

      return this.transfer(senderWallet, receiverWallet, amount, currency, trx)
    })
  }

  private async transfer(
    sender: Wallet,
    receiver: Wallet,
    amount: number,
    currency: string,
    trx: TransactionClientContract
  ) {
    const senderBalance = await sender.balance(trx)
    if (senderBalance < amount) throw new Error('Insufficient balance')

    const transaction = await Transaction.create({
      type: 'transfer',
      status: 'pending'
    }, { client: trx })

    await LedgerEntry.createMany([
      {
        amount,
        currency,
        direction: 'debit',
        walletId: sender.id,
        transactionId: transaction.id,
      },
      {
        amount,
        currency,
        direction: 'credit',
        walletId: receiver.id,
        transactionId: transaction.id,
      },
    ], { client: trx })

    transaction.status = 'completed'
    transaction.completedAt = DateTime.now()
    await transaction.save()

    return transaction
  }
}
