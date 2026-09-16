import { TransactionSchema } from '#database/schema'
import {beforeCreate, hasMany} from "@adonisjs/lucid/orm";
import type {HasMany} from "@adonisjs/lucid/types/relations";
import LedgerEntry from "#models/ledger_entry";
import {DateTime} from "luxon";

export default class Transaction extends TransactionSchema {
  @beforeCreate()
  static assignUid(transaction: Transaction) {
    transaction.uid ??= DateTime.now().toFormat('yymmddHHss')+Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  }

  @hasMany(() => LedgerEntry)
  declare ledgerEntries: HasMany<typeof LedgerEntry>
}
