const request = require('supertest')
const app = require('../../src/app')
const { setupDatabase, todoOneId, userOne } = require('../fixtures/db')
const Todo = require('../../src/models/todo')

beforeEach(setupDatabase)

const url = (id) => `/todos/${id}`

test('Should not delete todoOne with no authorization', async () => {

    await request(app)
        .delete(url(todoOneId))
        .send()
        .expect(401)

    const todo = await Todo.findById(todoOneId)
    expect(todo).not.toBeNull()
})

test('Should not delete a todo with invalid id', async () => {

    await request(app)
        .delete(url('604987eb007d465bd84db279'))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should delete todoOne', async () => {

    await request(app)
        .delete(url(todoOneId))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const todo = await Todo.findById(todoOneId)
    expect(todo).toBeNull()
})

test('Should delete userOne with its todos', async ()=> {
    await request(app)
    .delete('/users')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const tasks = await Todo.find({owner: userOne._id})
    expect(tasks.length).toBe(0)
})
