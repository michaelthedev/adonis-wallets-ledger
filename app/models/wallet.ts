import { WalletSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Wallet extends WalletSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
