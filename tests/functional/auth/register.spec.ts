import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from "#models/user";

test.group('Auth signup', (group) => {
  group.each.setup(() => {
    return testUtils.db().truncate()
  })

  test('return error when required fields are not provided', async ({ client }) => {
    const response = await client.visit('auth.register')

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'firstName',
          message: 'The firstName field must be defined',
          rule: 'required',
        },
        {
          field: 'lastName',
          message: 'The lastName field must be defined',
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

  test('create user account', async ({ client, assert }) => {
    const response = await client.visit('auth.register').json({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'password01#',
      passwordConfirmation: 'password01#',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      data: {
        user: {
          email: 'john@test.com',
        }
      },
    })

    const body = response.body();
    const user = await User.findOrFail(body.data?.user.id)
    assert.equal(user.email, 'john@test.com')
  })
})
