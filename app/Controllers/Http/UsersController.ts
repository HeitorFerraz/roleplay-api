import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['email', 'username', 'password'])

    if (!userPayload.email || !userPayload.username || !userPayload.password)
      throw new BadRequest('', 422)

    const userByEmail = await User.findBy('email', userPayload.email)
    if (userByEmail) throw new BadRequest('email already in use', 409)

    const userByUsername = await User.findBy('username', userPayload.username)
    if (userByUsername) throw new BadRequest('username already in use', 409)

    const user = await User.create(userPayload)
    return response.created({ user })
  }
}
