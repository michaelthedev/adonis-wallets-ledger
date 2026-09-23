import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createUser, createUserWithBalance, createWallet} from '#tests/helpers/index'
import LedgerEntry from "#models/ledger_entry";
import db from "@adonisjs/lucid/services/db";

test.group('Wallets -> transfer', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('fails on insufficient balance', async ({ client }) => {
    const { user: sender } = await createUserWithBalance(100, 'USD')
    const receiver = await createUser({}, { withWallets: true })

    const response = await client
      .visit('wallets.transfer')
      .loginAs(sender)
      .json({
        receiver: receiver.email,
        amount: 300,
        currency: 'USD',
      })

    response.assertStatus(400)

    response.assertBodyContains({
      success: false,
      message: 'Insufficient wallet balance'
    })
  })

  test('transfer between users', async ({ client, assert }) => {
    const { user: sender, wallet: senderWallet } = await createUserWithBalance(1000, 'USD')
    const receiver = await createUser({}, { withWallets: true })

    const response = await client
      .visit('wallets.transfer')
      .loginAs(sender)
      .json({
        receiver: receiver.email,
        amount: 300,
        currency: 'USD',
      })

    response.assertStatus(200)

    const body = response.body()
    const receiverWallet = await createWallet(receiver, 'USD');

    assert.equal(await senderWallet.balance(), 700)
    assert.equal(await receiverWallet.balance(), 300)

    const debitEntry = await LedgerEntry.query()
      .where('wallet_id', senderWallet.id)
      .where('direction', 'debit')
      .firstOrFail()

    assert.equal(debitEntry.amount, 300)

    // zero-sum
    const transactionId = body.data?.id
    const rows = await LedgerEntry.query()
      .where('transaction_id', transactionId)
      .groupBy('currency')
      .select('currency')
      .select(db.raw(`SUM(CASE WHEN direction = 'credit' THEN amount ELSE -amount END) as net`))

    for (const row of rows) {
      assert.equal(Number(row.$extras.net), 0)
    }
  })
})
