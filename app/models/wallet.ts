import { WalletSchema } from '#database/schema'
import {belongsTo, hasMany} from '@adonisjs/lucid/orm'
import type {BelongsTo, HasMany} from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import LedgerEntry from "#models/ledger_entry";

export default class Wallet extends WalletSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => LedgerEntry)
  declare ledgerEntries: HasMany<typeof LedgerEntry>
}
