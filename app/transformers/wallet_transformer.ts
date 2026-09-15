import { BaseTransformer } from '@adonisjs/core/transformers'
import Wallet from '#models/wallet'

export default class WalletTransformer extends BaseTransformer<Wallet> {
  toObject() {
    return this.pick(this.resource, ['id', 'currency'])
  }
}
