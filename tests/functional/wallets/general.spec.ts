import { test } from '@japa/runner'
import { createUser } from '#tests/helpers/index'

test.group('Wallets -> index', () => {
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
