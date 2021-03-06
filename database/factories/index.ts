import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const userFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}).build()
