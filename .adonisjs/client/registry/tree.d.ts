/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    register: typeof routes['auth.register']
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    auth: {
      logout: typeof routes['profile.auth.logout']
    }
  }
  wallets: {
    index: typeof routes['wallets.index']
    deposit: typeof routes['wallets.deposit']
    transfer: typeof routes['wallets.transfer']
    single: typeof routes['wallets.single']
  }
}
