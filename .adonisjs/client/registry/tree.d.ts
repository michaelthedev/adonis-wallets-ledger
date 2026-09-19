/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    auth: {
      login: typeof routes['auth.auth.login']
      register: typeof routes['auth.auth.register']
    }
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
    wallets: {
      index: typeof routes['wallets.wallets.index']
      deposit: typeof routes['wallets.wallets.deposit']
      transfer: typeof routes['wallets.wallets.transfer']
      single: typeof routes['wallets.wallets.single']
    }
  }
}
