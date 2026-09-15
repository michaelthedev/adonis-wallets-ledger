import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('uid').notNullable().unique();
      table.enum('type', ['transfer', 'deposit', 'withdrawal']).notNullable();
      table.enum('status', ['pending', 'completed', 'failed', 'reversed']).notNullable();
      table.string('idempotency_key').nullable().unique()

      table.timestamp('created_at')
      // table.timestamp('updated_at')
      table.timestamp('completed_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
