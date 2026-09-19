import vine from '@vinejs/vine'

const amountRule = () => vine.number().positive().withoutDecimals()

export const transferValidator = vine.create({
  amount: amountRule(),
  currency: vine.string(),
  receiver: vine.string(), // email for now
})

export const depositValidator = vine.create({
  amount: amountRule(),
  currency: vine.string()
})
