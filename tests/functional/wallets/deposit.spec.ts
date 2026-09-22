import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createUser, createWallet } from '#tests/helpers/index'

test.group('Wallets -> deposit', (group) => {
  group.each.setup(() => testUtils.db().truncate())

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
  })
})
