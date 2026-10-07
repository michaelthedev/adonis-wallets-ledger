import { BaseTransformer } from '@adonisjs/core/transformers'
import type Transaction from '#models/transaction'

export default class TransactionTransformer extends BaseTransformer<Transaction> {
  toObject() {
    return this.pick(this.resource, ['uid', 'type', 'status', 'completedAt', 'createdAt'])
  }
}
