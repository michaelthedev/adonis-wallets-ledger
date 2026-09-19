import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
    'wallets.wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.wallets.deposit': { paramsTuple?: []; params?: {} }
    'wallets.wallets.transfer': { paramsTuple?: []; params?: {} }
    'wallets.wallets.single': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'wallets.wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.wallets.single': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'wallets.wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.wallets.single': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
    'wallets.wallets.deposit': { paramsTuple?: []; params?: {} }
    'wallets.wallets.transfer': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}