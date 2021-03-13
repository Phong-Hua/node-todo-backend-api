const request = require('supertest')
const { setupDatabase, createUserTemplate, userOne, } = require('../fixtures/db')
const app = require('../../src/app')
const User = require('../../src/models/user')

beforeEach(setupDatabase)

const url = '/users'

test('Should not delete userOne with no authorization', async ()=> {
    await request(app)
    .delete(url)
    .send()
    .expect(401)

    const user = await User.findById(userOne._id)
    expect(user).not.toBeNull()
})


test('Should delete userOne', async ()=> {
    await request(app)
    .delete(url)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})
