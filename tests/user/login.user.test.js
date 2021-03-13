const request = require('supertest')
const { setupDatabase, createUserTemplate, userOne, } = require('../fixtures/db')
const app = require('../../src/app')
const User = require('../../src/models/user')

beforeEach(setupDatabase)

const url = '/users/login'

test('Should login with userOne', async () => {
    const response = await request(app)
        .post(url)
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200)
})

test('Should not login with invalid email', async () => {
    await request(app)
        .post(url)
        .send({
            email: 'fake'.concat(userOne.email),
            password: userOne.password,
        })
        .expect(400)
})

test('Should not login with invalid password', async () => {
    await request(app)
        .post(url)
        .send({
            email: userOne.email,
            password: 'invalid'.concat(userOne.password),
        })
        .expect(400)
})