import { TransactionSchema } from '#database/schema'
import { beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import LedgerEntry from '#models/ledger_entry'
import { TransactionStatus, TransactionType } from '#constants/transactions'
import { randomUUID } from 'node:crypto'

export default class Transaction extends TransactionSchema {
  @beforeCreate()
  static assignUid(transaction: Transaction) {
    transaction.uid ??= randomUUID()
  }

  @hasMany(() => LedgerEntry)
  declare ledgerEntries: HasMany<typeof LedgerEntry>

  declare type: TransactionType
  declare status: TransactionStatus
}
