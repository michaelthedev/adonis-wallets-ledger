import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
    'wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.deposit': { paramsTuple?: []; params?: {} }
    'wallets.transfer': { paramsTuple?: []; params?: {} }
    'wallets.single': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.single': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.single': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
    'wallets.deposit': { paramsTuple?: []; params?: {} }
    'wallets.transfer': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}