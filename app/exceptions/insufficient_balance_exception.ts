import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InsufficientBalanceException extends Exception {
  static status = 400

  handle(error: this, { response }: HttpContext) {
    return response
      .status(error.constructor.status)
      .json({
        success: false,
        message: 'Insufficient wallet balance',
        data: null
      })
  }
}
