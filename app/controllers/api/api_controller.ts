import { HttpContext } from '@adonisjs/core/http';
import {inject} from "@adonisjs/core";
import User from "#models/user";

@inject()
export default class ApiController {
  constructor(protected ctx: HttpContext) {}

  protected getUser(): User {
    return this.ctx.auth.getUserOrFail()
  }

  /**
   * @example
   * return this.response('Success', { user: user }, 200) // OR
   * return this.response({ message: 'Success', data: { user }, status: 200 })
   */
  protected async response(
    message: string|Record<string, any> = 'success',
    data: any = null,
    status: number = 200
  ) {
    const response = this.ctx.response;
    response.removeHeader('X-Powered-By') // example

    // if message is a record, we can extract from it
    if (typeof message === 'object') {
      data = message.data || data
      status = message.status || status
      message = message.message || 'success'
    }

    //@todo: fix serialize not working
    const payload =
      data === null
        ? null
        : await this.ctx.serialize.withoutWrapping(data, this.ctx.containerResolver)

    response.status(status);
    return {
      success: status < 400,
      message,
      data: payload,
    }
  }
}
