import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createUser, createUserWithBalance} from '#tests/helpers/index'
import LedgerEntry from "#models/ledger_entry";

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

    assert.equal(await senderWallet.balance(), 700)

    const debitEntry = await LedgerEntry.query()
      .where('wallet_id', senderWallet.id)
      .where('direction', 'debit')
      .firstOrFail()

    assert.equal(debitEntry.amount, 300)
  })
})
