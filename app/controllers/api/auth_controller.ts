import type { HttpContext } from '@adonisjs/core/http'
import {loginValidator, signupValidator} from "#validators/user";

import User from "#models/user";
import UserTransformer from "#transformers/user_transformer";
import ApiController from "#controllers/api/api_controller";
import {AccessToken} from "@adonisjs/auth/access_tokens";
import WalletService from "#services/wallet_service";
import {inject} from "@adonisjs/core";


export default class AuthController extends ApiController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7 days'
    });

    return this.response('success', {
      ...this.tokenResponse(token),
      user: UserTransformer.transform(user),
    })
  }

  @inject()
  async register({ request }: HttpContext, walletService: WalletService) {
    const { firstName, lastName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ firstName, lastName, email, password })
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7 days'
    })

    await walletService.createDefault(user.id)

    return this.response('success', {
      ...this.tokenResponse(token),
      user: UserTransformer.transform(user),
    }, 201)
  }

  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return this.response('success');
  }

  private tokenResponse(token: AccessToken) {
    return {
      type: 'bearer',
      expiryAt: token.expiresAt,
      token: token.value!.release(),
    }
  }
}
