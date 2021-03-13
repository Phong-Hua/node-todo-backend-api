const request = require('supertest')
const app = require('../../src/app')
const { setupDatabase, todoOne, todoTwo, todoOneId, todoTwoId, createTodoTemplate, userOne } = require('../fixtures/db')
const Todo = require('../../src/models/todo')

beforeEach(setupDatabase)


test('Shoud return 1 todo for userOne', async () => {
    const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should return todoOne', async () => {
    const response = await request(app)
        .get(`/todos/${todoOneId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body).toMatchObject({
        ...todoOne,
        _id: todoOne._id.toString(),
        'owner': {
            _id: userOne._id.toString()
        }
    })
})

test('Should not return any task with invalid status', async () => {
    throw new Error();
})

test('Should return task with valid status', async () => {
    throw new Error();
})
