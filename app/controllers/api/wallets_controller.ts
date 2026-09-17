import type { HttpContext } from '@adonisjs/core/http'
import ApiController from "#controllers/api/api_controller";

import {transferValidator} from "#validators/wallet";
import {inject} from "@adonisjs/core";
import TransferService from "#services/transfer_service";

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

  async single({ params }: HttpContext) {
    const user = this.getUser()
    const wallet = await user.related('wallets').query()
      .where('id', params.id).first();

    if (! wallet) {
      return this.response({
        status: 400,
        message: 'Invalid wallet selected',
      });
    }

    return this.response({
      message: 'success',
      data: wallet
    })
  }

  @inject()
  async transfer(
    { request }: HttpContext,
    transferService: TransferService
  ) {
    const user = this.getUser();
    const payload = await request.validateUsing(transferValidator);

    try {
      const result = await transferService.init(user.id, payload.receiver, payload.amount, payload.currency);

      return this.response({
        status: 201,
        message: 'Transfer successful',
        data: result
      });
    } catch (error: any) {
      return this.response({
        status: 400,
        message: error.message || 'Transfer failed',
      });
    }
  }
}
