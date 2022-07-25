import Database from '@ioc:Adonis/Lucid/Database'
import { userFactory } from 'Database/factories'
import supertest from 'supertest'
import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {
  test('Criar Usuário', async (assert) => {
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

  test('Retorna 409 se o email estiver em uso', async (assert) => {
    const { email } = await userFactory.create()

    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test123',
      })
      .expect(409)

    assert.exists(body.message)
    assert.exists(body.status)
    assert.exists(body.code)
    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('Retornar 409 se o Nome de Usuário estiver em uso', async (assert) => {
    const { username } = await userFactory.create()

    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        username,
        email: 'test@email.com',
        password: 'test123',
      })
      .expect(409)

    assert.exists(body.message)
    assert.exists(body.status)
    assert.exists(body.code)
    assert.include(body.message, 'username')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test.only('Retornar 422 falta os dados obrigatorios', async (assert) => {
    const body = await supertest(BASE_URL).post('/users').send({}).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.beforeEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
