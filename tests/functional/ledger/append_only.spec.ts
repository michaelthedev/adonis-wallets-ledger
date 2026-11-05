import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import LedgerEntry from '#models/ledger_entry'
import { createUserWithBalance } from '#tests/helpers/index'

test.group('Ledger', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('blocks ledger updates and deletes', async ({ assert }) => {
    const { wallet } = await createUserWithBalance(100)
    const entry = await LedgerEntry.query().where('wallet_id', wallet.id).firstOrFail()

    await assert.rejects(() => entry.merge({ amount: 1 }).save(), /append-only/)
    await assert.rejects(() => entry.delete(), /append-only/)

    assert.equal(await wallet.balance(), 100)
  })
})
