import { test } from '@japa/runner'
import { createUser, createWallet } from '#tests/helpers/index'
import LedgerEntry from '#models/ledger_entry'

test.group('Wallets -> deposit', () => {
  test('deposit fund into wallet', async ({ client, assert }) => {
    const user = await createUser()
    const wallet = await createWallet(user, 'USD')

    const response = await client
      .visit('wallets.deposit')
      .loginAs(user)
      .json({
        amount: 500,
        currency: 'USD'
      })

    response.assertStatus(200)

    const balance = await wallet.balance()
    assert.equal(balance, 500)

    const depositEntry = await LedgerEntry.query()
      .where('wallet_id', wallet.id)
      .where('direction', 'credit')
      .first()

    assert.isNotNull(depositEntry)
    assert.equal(depositEntry?.amount, 500)
  })

  test('deposit fails on invalid amount', async ({ client }) => {
    const user = await createUser()

    const response = await client
      .visit('wallets.deposit')
      .loginAs(user)
      .json({
        amount: -1,
        currency: 'USD'
      })

    response.assertStatus(422)
    // response.assertBodyContains();
  })

  test('deposit fails on invalid currency', async ({ client }) => {
    const user = await createUser()

    const response = await client
      .visit('wallets.deposit')
      .loginAs(user)
      .json({
        amount: 10,
        // @ts-ignore
        currency: 'XYZ'
      })

    response.assertStatus(422)
  })

  test('deposit fails on missing token', async ({ client }) => {
    const response = await client
      .visit('wallets.deposit')
      .json({
        amount: 10,
        currency: 'USD'
      })

    response.assertStatus(401)
  })
})
