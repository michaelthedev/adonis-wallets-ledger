import vine from '@vinejs/vine'

const amountRule = () => vine.number().positive().decimal([0, 2])

export const transferValidator = vine.create({
  amount: amountRule(),
  currency: vine.string(),
  receiver: vine.string(), // email for now
})
