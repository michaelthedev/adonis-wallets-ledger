import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createUser, createWallet } from '#tests/helpers/index'

test.group('Wallets -> index', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('list wallets for user', async ({ client, assert }) => {
    const user = await createUser({}, { withWallets: true })

    const response = await client.visit('wallets.index').loginAs(user)

    response.assertStatus(200)

    const body = response.body()

    assert.equal(body.data?.length, 2)

    body.data?.forEach((wallet: any) => {
      assert.onlyProperties(wallet, ['id', 'currency', 'balance'])
    })
  })

  test('shows own wallet', async ({ client, assert }) => {
    const user = await createUser()
    const wallet = await createWallet(user, 'USD')

    const fundingResponse = await client.visit('wallets.deposit').loginAs(user).json({
      amount: 100,
      currency: 'USD',
    })

    fundingResponse.assertStatus(200)

    const balance = await wallet.balance()
    assert.equal(balance, 100)

    const response = await client.visit('wallets.single', { id: wallet.id }).loginAs(user)

    response.assertStatus(200)
    const body = response.body()

    // assert.properties(body.data, ['id', 'currency', 'balance'])
    assert.onlyProperties(body.data, ['id', 'currency', 'balance'])
  })

  test('fails on wrong wallet', async ({ client }) => {
    const user = await createUser({}, { withWallets: true })

    const response = await client.visit('wallets.single', { id: 9999 }).loginAs(user)

    response.assertStatus(404)
  })
})
