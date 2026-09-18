import type { HttpContext } from '@adonisjs/core/http'
import ApiController from "#controllers/api/api_controller";

import {transferValidator} from "#validators/wallet";
import {inject} from "@adonisjs/core";
import WalletService from "#services/wallet_service";
import TransferService from "#services/transfer_service";

export default class WalletsController extends ApiController {
  @inject()
  async index({}: HttpContext, walletService: WalletService) {
    return this.response({
      data: await walletService.listWithBalance(this.getUser().id)
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
