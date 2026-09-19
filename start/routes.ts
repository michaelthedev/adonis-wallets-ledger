import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'


router.get('/', () => {
  return { hello: 'world' }
})

router.group(() => {
  router.group(() => {
    router.post('login', [controllers.api.Auth, 'login'])
    router.post('register', [controllers.api.Auth, 'register'])
  }).prefix('auth').as('auth')

  ///// AUTHENTICATED /////
  router.group(() => {
    router.group(() => {
      router.get('profile', [controllers.Profile, 'show'])
      router.post('logout', [controllers.api.Auth, 'logout'])
    }).prefix('account').as('profile')

    router.group(() => {
      router.get('/', [controllers.api.Wallets, 'index'])
      router.post('/deposit', [controllers.api.Wallets, 'deposit'])
      router.post('/transfer', [controllers.api.Wallets, 'transfer'])
      router.get('/:id', [controllers.api.Wallets, 'single']).where('id', /^[0-9]+$/)
    }).prefix('wallets').as('wallets')
  }).use(middleware.auth())

}).prefix('/api/v1')
