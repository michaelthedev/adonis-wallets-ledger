// import type { HttpContext } from '@adonisjs/core/http'
import ApiController from "#controllers/api/api_controller";

export default class WalletsController extends ApiController {
  async index() {
    const user = this.getUser()
    await user.load('wallets');

    const wallets = await this.getUser()
      .related('wallets')
      .query()
      .withAggregate('ledgerEntries',
        (q) => q.where('direction', 'credit').sum('amount').as('credits')
      )
      .withAggregate('ledgerEntries',
        (q) => q.where('direction', 'debit').sum('amount').as('debits')
      );

    return this.response({
      data: wallets.map((wallet) => ({
        id: wallet.id,
        currency: wallet.currency,
        balance: Number(wallet.$extras.credits ?? 0) - Number(wallet.$extras.debits ?? 0),
      }))
    });
  }
    })
  }
}
