import Database from '@ioc:Adonis/Lucid/Database'
import { userFactory } from 'Database/factories'
import supertest from 'supertest'
import test from 'japa'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {
  test('it should create an user', async (assert) => {
    const userPayload = {
      email: 'test@email.com',
      username: 'test',
      password: 'test123',
    }

    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)

    assert.exists(body.user, 'User Undefined')
    assert.exists(body.user.id, 'ID Undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.notExists(body.user.password, userPayload.password)
  })

  test('it should return 409 when email is already in use', async (assert) => {
    const { email } = await userFactory.create()

    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test123',
      })
      .expect(409)

    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.beforeEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
