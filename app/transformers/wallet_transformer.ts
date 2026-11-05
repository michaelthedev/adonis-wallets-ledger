import { BaseTransformer } from '@adonisjs/core/transformers'
import type Wallet from '#models/wallet'

export default class WalletTransformer extends BaseTransformer<Wallet> {
  async toObject() {
    const wallet = this.resource
    const balance = await wallet.balance()

    return {
      id: wallet.id,
      currency: wallet.currency,
      balance,
    }
  }
}
