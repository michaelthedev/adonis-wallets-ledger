import { BaseTransformer } from '@adonisjs/core/transformers'
import Transaction from '#models/transaction'

export default class TransactionTransformer extends BaseTransformer<Transaction> {
  toObject() {
    return this.pick(this.resource, ['id', 'uid', 'type', 'status', 'createdAt'])
  }
}
