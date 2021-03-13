const request = require('supertest')
const bcrypt = require('bcryptjs')
const { setupDatabase, createUserTemplate, userOne, } = require('../fixtures/db')
const app = require('../../src/app')
const User = require('../../src/models/user')

beforeEach(setupDatabase)

const url = '/users'

test('Should not update userOne with no authorization', async ()=> {

    const userTemplate = createUserTemplate();
    delete userTemplate.email;
    
    await request(app)
    .patch(url)
    .send(userTemplate)
    .expect(401)

    // const user = await User.findById(userOne._id)
    // expect(user).not.toBeNull()
})

test('Should not update userOne email', async ()=> {

    const userTemplate = createUserTemplate();
    const email = userTemplate.email

    await request(app)
    .patch(url)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        email,
    })
    .expect(400)

    const user = await User.findById(userOne._id)
    expect(user).toMatchObject({email: userOne.email})
})

/**
 * Test if we can update firstname, lastname, password
 */
test('Should update userOne', async ()=> {

    const userTemplate = createUserTemplate();
    delete userTemplate.email

    await request(app)
    .patch(url)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(userTemplate)
    .expect(200)

    const user = await User.findById(userOne._id)
    
    expect(user).toMatchObject({
        firstname: userTemplate.firstname,
        lastname: userTemplate.lastname,
        // we dont check the plain password and hashed password
    })
})

test('Should update userOne password and hashed password', async ()=> {

    const password = createUserTemplate().password;

    await request(app)
    .patch(url)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({password})
    .expect(200)

    const user = await User.findById(userOne._id)
    const passwordMatch = await bcrypt.compare(password, user.password)
    expect(passwordMatch).toBe(true)
})