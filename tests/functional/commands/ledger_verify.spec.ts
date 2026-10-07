import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import ace from '@adonisjs/core/services/ace'
import LedgerVerify from '#commands/ledger_verify'
import Transaction from '#models/transaction'
import LedgerEntry from '#models/ledger_entry'
import { createUser, createWallet, createUserWithBalance } from '#tests/helpers/index'
import {DateTime} from "luxon";

test.group('Commands -> ledger:verify', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('passes on a clean ledger', async ({ assert }) => {
    const { user, wallet } = await createUserWithBalance(500, 'USD')
    assert.isNotNull(user)
    assert.isNotNull(wallet)

    const command = await ace.create(LedgerVerify, [])
    await command.exec()

    assert.equal(command.exitCode, 0)
  })

  test('fails C1 when transfer entries do not net to zero', async ({ assert }) => {
    const user = await createUser()
    const wallet = await createWallet(user, 'USD')

    const tx = await Transaction.create({
      type: 'transfer',
      status: 'completed',
    })

    await LedgerEntry.create({
      transactionId: tx.id,
      walletId: wallet.id,
      amount: 100,
      currency: 'USD',
      direction: 'credit',
    })

    const command = await ace.create(LedgerVerify, [])
    await command.exec()

    assert.equal(command.exitCode, 1)
  })

  test('fails C2 when wallet with a negative balance', async ({ assert }) => {
    const user = await createUser()
    const wallet = await createWallet(user, 'USD')

    const tx = await Transaction.create({
      type: 'withdrawal',
      status: 'completed',
    })

    await LedgerEntry.create({
      transactionId: tx.id,
      walletId: wallet.id,
      amount: 100,
      currency: 'USD',
      direction: 'debit',
    })

    const command = await ace.create(LedgerVerify, [])
    await command.exec()

    assert.equal(command.exitCode, 1)
  })

  test('fails C3 when entry currency does not match wallet currency', async ({ assert }) => {
    const user = await createUser()
    const wallet = await createWallet(user, 'USD')

    const tx = await Transaction.create({
      type: 'deposit',
      status: 'completed',
    })

    await LedgerEntry.create({
      transactionId: tx.id,
      walletId: wallet.id,
      amount: 100,
      currency: 'NGN',
      direction: 'credit',
    })

    const command = await ace.create(LedgerVerify, [])
    await command.exec()

    assert.equal(command.exitCode, 1)
  })

  test('fails C4 when completed transaction has no ledger entries', async ({ assert }) => {
    await Transaction.create({
      type: 'transfer',
      status: 'completed',
    })

    const command = await ace.create(LedgerVerify, [])
    await command.exec()

    assert.equal(command.exitCode, 1)
  })

  test('fails C5 when a transaction stuck in pending for > 5 minutes', async ({ assert }) => {
    await Transaction.create({
      type: 'transfer',
      status: 'pending',
      createdAt: DateTime.now().minus({ minutes: 6 })
    })

    const command = await ace.create(LedgerVerify, [])
    await command.exec()

    assert.equal(command.exitCode, 1)
  })
})
