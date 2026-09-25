import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createUser, createUserWithBalance, createWallet } from '#tests/helpers/index'
import LedgerEntry from '#models/ledger_entry'
import Transaction from '#models/transaction'
import Wallet from '#models/wallet'
import db from '@adonisjs/lucid/services/db'

test.group('Wallets -> transfer', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('fails on insufficient balance and rolls back', async ({ client, assert }) => {
    const { user: sender, wallet: senderWallet } = await createUserWithBalance(100, 'USD')
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
      message: 'Insufficient wallet balance',
    })

    const transferTx = await Transaction.query().where('type', 'transfer').first()
    assert.isNull(transferTx)

    const entries = await LedgerEntry.query().where('wallet_id', senderWallet.id)
    assert.equal(entries.length, 1)
    assert.equal(entries[0].direction, 'credit')
    assert.equal(await senderWallet.balance(), 100)
  })

  test('fails on self transfer', async ({ client }) => {
    const { user: sender } = await createUserWithBalance(100, 'USD')

    const response = await client
      .visit('wallets.transfer')
      .loginAs(sender)
      .json({
        receiver: sender.email,
        amount: 300,
        currency: 'USD',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      success: false,
      message: 'You cannot transfer to yourself',
    })
  })

  test('auto-creates receiver wallet if not present', async ({ client, assert }) => {
    const { user: sender, wallet: senderWallet } = await createUserWithBalance(500, 'USD')
    const receiver = await createUser()

    const response = await client
      .visit('wallets.transfer')
      .loginAs(sender)
      .json({
        receiver: receiver.email,
        amount: 200,
        currency: 'USD',
      })

    response.assertStatus(200)

    const receiverWallet = await Wallet.query()
      .where('user_id', receiver.id)
      .where('currency', 'USD')
      .firstOrFail()

    assert.equal(await senderWallet.balance(), 300)
    assert.equal(await receiverWallet.balance(), 200)
  })

  test('fails when receiver does not exist', async ({ client }) => {
    const { user: sender } = await createUserWithBalance(500, 'USD')

    const response = await client
      .visit('wallets.transfer')
      .loginAs(sender)
      .json({
        receiver: 'nonexistent@example.com',
        amount: 100,
        currency: 'USD',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      success: false,
      message: 'Invalid receiver selected',
    })
  })

  test('fails on missing token', async ({ client }) => {
    const response = await client
      .visit('wallets.transfer')
      .json({
        receiver: 'anyone@example.com',
        amount: 100,
        currency: 'USD',
      })

    response.assertStatus(401)
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
    const receiverWallet = await createWallet(receiver, 'USD')

    assert.equal(await senderWallet.balance(), 700)
    assert.equal(await receiverWallet.balance(), 300)

    const transaction = await Transaction.findByOrFail('uid', body.data?.uid)

    const debitEntry = await LedgerEntry.query()
      .where('wallet_id', senderWallet.id)
      .where('transaction_id', transaction.id)
      .where('direction', 'debit')
      .firstOrFail()

    assert.equal(debitEntry.amount, 300)

    const creditEntry = await LedgerEntry.query()
      .where('wallet_id', receiverWallet.id)
      .where('transaction_id', transaction.id)
      .where('direction', 'credit')
      .firstOrFail()

    assert.equal(creditEntry.amount, 300)

    // zero-sum: debit and credit entries net to zero
    const rows = await LedgerEntry.query()
      .where('transaction_id', transaction.id)
      .groupBy('currency')
      .select('currency')
      .select(
        db.knexRawQuery(`SUM(CASE WHEN direction = 'credit' THEN amount ELSE -amount END) as net`)
      )

    for (const row of rows) {
      assert.equal(Number(row.$extras.net), 0)
    }
  })
})

test.group('Wallets -> transfer (concurrency)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('concurrent transfers with insufficient funds allows only one to succeed', async ({ client, assert }) => {
    const { user: sender, wallet: senderWallet } = await createUserWithBalance(100, 'USD')
    const receiver = await createUser({}, { withWallets: true })

    const [res1, res2] = await Promise.all([
      client.visit('wallets.transfer').loginAs(sender).json({
        receiver: receiver.email,
        amount: 80,
        currency: 'USD',
      }),
      client.visit('wallets.transfer').loginAs(sender).json({
        receiver: receiver.email,
        amount: 80,
        currency: 'USD',
      }),
    ])

    const statuses = [res1.status(), res2.status()].sort()
    assert.deepEqual(statuses, [200, 400])

    const finalBalance = await senderWallet.balance()
    assert.equal(finalBalance, 20)
  })
})
