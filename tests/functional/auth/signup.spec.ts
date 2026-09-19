import { test } from '@japa/runner'

test.group('Auth signup', () => {
  test('return error when required fields are not provided', async ({ client }) => {
    const response = await client.visit('new_account.store')

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'fullName',
          message: 'The fullName field must be defined',
          rule: 'required',
        },
        {
          field: 'email',
          message: 'The email field must be defined',
          rule: 'required',
        },
        {
          field: 'password',
          message: 'The password field must be defined',
          rule: 'required',
        },
        {
          field: 'passwordConfirmation',
          message: 'The passwordConfirmation field must be defined',
          rule: 'required',
        },
      ],
    })
  })
})
