import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Auth login', (group) => {
  group.each.setup(() => {
    return testUtils.db().truncate()
  })

  test('return error when required fields are not provided', async ({ client }) => {
    const response = await client.visit('auth.login')

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
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
      ],
    })
  })

  test('login and logout user account', async ({ client, assert }) => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'John',
      email: 'john@test.com',
      password: 'secret',
    })

    const response = await client.visit('auth.login').json({
      email: 'john@test.com',
      password: 'secret',
    })

    response.assertStatus(200)

    const body = response.body()
    assert.notEmpty(body.data?.token)
    assert.isObject(body.data?.user)
    assert.equal(body.data?.user.email, user.email)

    // logout
    const logoutResponse = await client.visit('auth.logout').bearerToken(body.data?.token)

    logoutResponse.assertStatus(200)

    // confirm the token has been revoked
    const profileResponse = await client.visit('profile.show').bearerToken(body.data?.token)

    profileResponse.dumpBody()
    profileResponse.assertStatus(401)
  })
})
