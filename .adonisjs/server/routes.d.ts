import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}