/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.auth.logout']['types'],
  },
  'wallets.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/wallets',
    tokens: [{"old":"/api/v1/wallets","type":0,"val":"api","end":""},{"old":"/api/v1/wallets","type":0,"val":"v1","end":""},{"old":"/api/v1/wallets","type":0,"val":"wallets","end":""}],
    types: placeholder as Registry['wallets.index']['types'],
  },
  'wallets.deposit': {
    methods: ["POST"],
    pattern: '/api/v1/wallets/deposit',
    tokens: [{"old":"/api/v1/wallets/deposit","type":0,"val":"api","end":""},{"old":"/api/v1/wallets/deposit","type":0,"val":"v1","end":""},{"old":"/api/v1/wallets/deposit","type":0,"val":"wallets","end":""},{"old":"/api/v1/wallets/deposit","type":0,"val":"deposit","end":""}],
    types: placeholder as Registry['wallets.deposit']['types'],
  },
  'wallets.transfer': {
    methods: ["POST"],
    pattern: '/api/v1/wallets/transfer',
    tokens: [{"old":"/api/v1/wallets/transfer","type":0,"val":"api","end":""},{"old":"/api/v1/wallets/transfer","type":0,"val":"v1","end":""},{"old":"/api/v1/wallets/transfer","type":0,"val":"wallets","end":""},{"old":"/api/v1/wallets/transfer","type":0,"val":"transfer","end":""}],
    types: placeholder as Registry['wallets.transfer']['types'],
  },
  'wallets.single': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/wallets/:id',
    tokens: [{"old":"/api/v1/wallets/:id","type":0,"val":"api","end":""},{"old":"/api/v1/wallets/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/wallets/:id","type":0,"val":"wallets","end":""},{"old":"/api/v1/wallets/:id","type":1,"val":"id","end":""}],
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
