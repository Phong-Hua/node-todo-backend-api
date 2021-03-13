const request = require('supertest')
const { setupDatabase, createUserTemplate, userOne, } = require('../fixtures/db')
const app = require('../../src/app')
const User = require('../../src/models/user')

beforeEach(setupDatabase)

const url = '/users/logout'

test('Should logout with userOne', async () => {
    await request(app)
    .post(url)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.tokens.length).toBe(0)
})
