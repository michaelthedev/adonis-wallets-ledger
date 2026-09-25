import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createUser } from '#tests/helpers/index'

test.group('Wallets -> index', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('list wallets for user', async ({ client, assert }) => {
    const user = await createUser({}, { withWallets: true })

    const response = await client
      .visit('wallets.index')
      .loginAs(user)

    response.assertStatus(200)

    const body = response.body();

    assert.equal(body.data?.length, 2);

    body.data?.forEach((wallet: any) => {
      assert.onlyProperties(wallet, ['id', 'currency', 'balance'])
    })
  })
})
