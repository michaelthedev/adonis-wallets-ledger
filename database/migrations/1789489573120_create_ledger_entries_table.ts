import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ledger_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('transaction_id')
        .unsigned()
        .notNullable()
        .references('transactions.id')
        .onDelete('RESTRICT')

      table
        .integer('wallet_id')
        .unsigned()
        .notNullable()
        .references('wallets.id')
        .onDelete('RESTRICT')

      table.enum('direction', ['credit', 'debit']).notNullable()
      table.integer('amount').unsigned().notNullable()
      table.string('currency').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
