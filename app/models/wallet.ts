import { WalletSchema } from '#database/schema'
import User from '#models/user'
import LedgerEntry from "#models/ledger_entry";

import db from "@adonisjs/lucid/services/db";
import {belongsTo, hasMany} from '@adonisjs/lucid/orm'
import type {BelongsTo, HasMany} from '@adonisjs/lucid/types/relations'
import {TransactionClientContract} from "@adonisjs/lucid/types/database";

export default class Wallet extends WalletSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => LedgerEntry)
  declare ledgerEntries: HasMany<typeof LedgerEntry>

  async balance(trx?: TransactionClientContract) {
    const query = trx ? LedgerEntry.query({ client: trx }) : LedgerEntry.query()

    const result = await query
      .where('wallet_id', this.id)
      .select(
        db.raw(`COALESCE(SUM(CASE WHEN direction = 'credit' THEN amount ELSE -amount END)}, 0) as balance`)
      ).first()

    return Number(result?.$extras.balance ?? 0)
  }
}
