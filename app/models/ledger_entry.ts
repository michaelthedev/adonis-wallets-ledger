import { LedgerEntrySchema } from '#database/schema'
import {belongsTo} from "@adonisjs/lucid/orm";
import Wallet from "#models/wallet";
import Transaction from "#models/transaction";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class LedgerEntry extends LedgerEntrySchema {
  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>
}
