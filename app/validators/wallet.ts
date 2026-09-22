import vine from '@vinejs/vine'
import { SUPPORTED_CURRENCIES } from '../constants/currencies.js'

const amountRule = () => vine.number().positive().withoutDecimals()

export const transferValidator = vine.create({
  amount: amountRule(),
  currency: vine.enum(SUPPORTED_CURRENCIES),
  receiver: vine.string(), // email for now
})

export const depositValidator = vine.create({
  amount: amountRule(),
  currency: vine.enum(SUPPORTED_CURRENCIES)
})
