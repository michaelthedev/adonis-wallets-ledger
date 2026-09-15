import { TransactionSchema } from '#database/schema'
import {hasMany} from "@adonisjs/lucid/orm";
import type {HasMany} from "@adonisjs/lucid/types/relations";
import LedgerEntry from "#models/ledger_entry";

export default class Transaction extends TransactionSchema {
  @hasMany(() => LedgerEntry)
  declare ledgerEntries: HasMany<typeof LedgerEntry>
}
