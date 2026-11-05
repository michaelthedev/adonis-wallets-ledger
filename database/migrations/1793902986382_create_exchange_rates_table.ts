import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exchange_rates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('base_currency', 3).notNullable()
      table.string('quote_currency', 3).notNullable()
      table.decimal('rate', 20, 10).notNullable()
      table.timestamp('snapshot_at').notNullable()
      table.timestamp('created_at')

      table.unique(['base_currency', 'quote_currency', 'snapshot_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
