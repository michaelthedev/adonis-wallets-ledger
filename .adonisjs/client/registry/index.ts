/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"login"]],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"register"]],
    types: placeholder as Registry['auth.register']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.show']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"logout"]],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'wallets.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/wallets',
    tokens: [[0,"api"],[0,"v1"],[0,"wallets"]],
    types: placeholder as Registry['wallets.index']['types'],
  },
  'wallets.deposit': {
    methods: ["POST"],
    pattern: '/api/v1/wallets/deposit',
    tokens: [[0,"api"],[0,"v1"],[0,"wallets"],[0,"deposit"]],
    types: placeholder as Registry['wallets.deposit']['types'],
  },
  'wallets.transfer': {
    methods: ["POST"],
    pattern: '/api/v1/wallets/transfer',
    tokens: [[0,"api"],[0,"v1"],[0,"wallets"],[0,"transfer"]],
    types: placeholder as Registry['wallets.transfer']['types'],
  },
  'wallets.single': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/wallets/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"wallets"],[1,"id"]],
    types: placeholder as Registry['wallets.single']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
