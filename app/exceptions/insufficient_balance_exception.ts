import { Exception } from '@adonisjs/core/exceptions'

export default class InsufficientBalanceException extends Exception {
  static status = 400
}
