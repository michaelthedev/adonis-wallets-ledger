// import type { HttpContext } from '@adonisjs/core/http'
import ApiController from "#controllers/api/api_controller";
import WalletTransformer from "#transformers/wallet_transformer";

export default class WalletsController extends ApiController {
  async index() {
    const user = this.getUser()
    await user.load('wallets');

    return this.response('success', {
      wallets: WalletTransformer.transform(user.wallets),
    })
  }
}
