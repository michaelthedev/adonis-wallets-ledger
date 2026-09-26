import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class LedgerVerify extends BaseCommand {
  static commandName = 'ledger:verify'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "LedgerVerify"')
  }
}