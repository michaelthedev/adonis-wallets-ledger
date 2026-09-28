import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class LedgerVerify extends BaseCommand {
  static commandName = 'ledger:verify'
  static description = 'Verify ledger integrity'
  static options: CommandOptions = { startApp: true }

  async run() {
    let failed = false

    //@ todo: maybe allow a controlled deficit/overflow?
    const [unbalanced]: any = await db.rawQuery(`
      SELECT t.id, t.uid, le.currency, SUM(CASE WHEN le.direction = 'credit' THEN le.amount ELSE -le.amount END) AS net
      FROM ledger_entries le
      JOIN transactions t ON t.id = le.transaction_id
      WHERE t.type NOT IN ('deposit', 'withdrawal')
      GROUP BY t.id, t.uid, le.currency
      HAVING net <> 0
    `)
    if (unbalanced.length) {
      failed = true
      this.logger.error(`C1: ${unbalanced.length} transactions do not net to zero`)
      console.table(unbalanced)
    } else {
      this.logger.success('C1: Transactions net to zero')
    }

    const [negative]: any = await db.rawQuery(`
      SELECT wallet_id, SUM(CASE WHEN direction = 'credit' THEN amount ELSE -amount END) AS balance
      FROM ledger_entries
      GROUP BY wallet_id
      HAVING balance < 0
    `)
    if (negative.length) {
      failed = true
      this.logger.error(`C2: ${negative.length} negative wallet balances`)
      console.table(negative)
    } else {
      this.logger.success('C2: No negative balances')
    }

    const [mismatches]: any = await db.rawQuery(`
      SELECT le.id, le.currency, w.currency AS wallet_currency
      FROM ledger_entries le
      JOIN wallets w ON w.id = le.wallet_id
      WHERE le.currency <> w.currency
    `)
    if (mismatches.length) {
      failed = true
      this.logger.error(`C3: ${mismatches.length} entry currency mismatches`)
      console.table(mismatches)
    } else {
      this.logger.success('C3: Currency matches')
    }

    const [emptyTx]: any = await db.rawQuery(`
      SELECT t.id, t.uid FROM transactions t
      LEFT JOIN ledger_entries le ON le.transaction_id = t.id
      WHERE t.status = 'completed' AND le.id IS NULL
    `)
    if (emptyTx.length) {
      failed = true
      this.logger.error(`C4: ${emptyTx.length} completed transactions with no entries`)
      console.table(emptyTx)
    } else {
      this.logger.success('C4: Completed transactions have entries')
    }

    const [stuck]: any = await db.rawQuery(`
      SELECT id, uid, created_at FROM transactions
      WHERE status = 'pending' AND created_at < NOW() - INTERVAL 5 MINUTE
    `)
    if (stuck.length) {
      failed = true
      this.logger.error(`C5: ${stuck.length} transactions stuck in pending`)
      console.table(stuck)
    } else {
      this.logger.success('C5: No stuck pending transactions')
    }

    if (failed) {
      this.exitCode = 1
    }
  }
}
