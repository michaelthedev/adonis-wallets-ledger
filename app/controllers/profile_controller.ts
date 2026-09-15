import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import ApiController from "#controllers/api/api_controller";

export default class ProfileController extends ApiController {
  async show({ auth }: HttpContext) {
    return this.response({
      message: 'success',
      data: UserTransformer.transform(auth.getUserOrFail())
    });
  }
}
