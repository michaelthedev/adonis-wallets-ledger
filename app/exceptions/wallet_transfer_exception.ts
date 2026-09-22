import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class WalletTransferException extends Exception {
  static status = 500

  handle(error: this, { response }: HttpContext) {
    return response.status(error.status).json({
      success: false,
      message: error.message,
      data: null,
    })
  }
}
