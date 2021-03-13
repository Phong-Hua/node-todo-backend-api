const request = require('supertest')
const { setupDatabase, createUserTemplate, } = require('../fixtures/db')
const app = require('../../src/app')
const User = require('../../src/models/user')

beforeEach(setupDatabase)

const url = '/users'

test('Should create a new user', async () => {

    const userTemplate = createUserTemplate();

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(201)

    const user = await User.findById(response.body._id)
    expect(user).not.toBeNull()

    // Because the password is hashed, we don't expect the user contains original password
    delete userTemplate.password;
    expect(user).toMatchObject(userTemplate)
})

test('Should not create user with invalid email', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.email = '@mail.com';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})


test('Should not create user with email not provided', async () => {

    const userTemplate = createUserTemplate();
    delete userTemplate.email;

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})


test('Should not create user with firstname not provided', async () => {

    const userTemplate = createUserTemplate();
    delete userTemplate.firstname;

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with firstname is empty', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.firstname = '';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with lastname not provided', async () => {

    const userTemplate = createUserTemplate();
    delete userTemplate.lastname;

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with lastname is empty', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.lastname = '';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with password not provided', async () => {

    const userTemplate = createUserTemplate();
    delete userTemplate.password;

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with password is empty', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.password = '';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with password has less than 8 characters', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.password = 'Passw1';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with password has no uppercase', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.password = 'passw13456789';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with password has no lowercase', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.password = 'QWE123456789';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not create user with password has no digit', async () => {

    const userTemplate = createUserTemplate();
    userTemplate.password = 'QWEpaserodkdnf';

    const response = await request(app)
        .post(url)
        .send(userTemplate)
        .expect(400)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})