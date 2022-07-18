import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test.only('it should create an user', async (assert) => {
    const userPayload = { email: 'heitor@test.com', username: 'Heitor', password: 'test123' }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
    assert.exists(body.user, 'User Undefined')
    assert.exists(body.user.id, 'ID Undefined')
    assert.equal(body.user.username, userPayload.username)
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.password, userPayload.password)
  })
})
