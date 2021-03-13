const request = require('supertest')
const app = require('../../src/app')
const { setupDatabase, todoOne, todoTwo, todoOneId, todoTwoId, createTodoTemplate, userOne } = require('../fixtures/db')
const Todo = require('../../src/models/todo')

beforeEach(setupDatabase)

const url = (id) => `/todos/${id}`

test('Should not update todoOne with no authorization', async()=>{
    
    const update = {...todoOne};
    update.description = 'Updated'.concat(update.description);

    const response = await request(app)
        .patch(url(todoOne._id))
        .send(update)
        .expect(401)

    const todo = await Todo.findById(todoOne._id)
    expect(todo).toMatchObject(todoOne)
})

test('Should update todoOne', async () => {

    const update = {
        name : 'New todo name',
        description: 'New discription',
        status: 'done',
    };

    await request(app)
        .patch(url(todoOne._id))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(200)

    const todo = await Todo.findById(todoOne._id)
    expect(todo).not.toBeNull()

    // Expect the object retrieve from database match with the update content
    expect(todo).toMatchObject(update)
})

test('Should not update todoOne with invalid field', async () => {

    const update = {
        failed: 'This should be failed'
    }

    await request(app)
        .patch(url(todoOne._id))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(400)

    const todo = await Todo.findById(todoOneId)
    expect(todo).not.toBeNull()

    // Expect the object retrieve from database not match with the update content
    expect(todo).not.toMatchObject(update)
})

test('Should not update todoOne with name more than 20 characters', async () => {

    const update = {
        name: 'Another Todo and this should be more than 20 characters',
        description: 'New discription',
        status: 'completed',
    }

    await request(app)
        .patch(url(todoOne._id))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(400)

    const todo = await Todo.findById(todoOneId)
    expect(todo).not.toBeNull()

    // Expect the object retrieve from database not match with the update content
    expect(todo).not.toMatchObject(update)
})

test('Should not update todoOne with empty name', async () => {

    const update = {
        name: ' ',
        description: 'New discription',
        status: 'completed',
    }

    await request(app)
        .patch(url(todoOne._id))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(400)

    const todo = await Todo.findById(todoOneId)
    expect(todo).not.toBeNull()

    // Expect the object retrieve from database not match with the update content
    expect(todo).not.toMatchObject(update)
})
