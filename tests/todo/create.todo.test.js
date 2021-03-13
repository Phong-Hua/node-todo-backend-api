const request = require('supertest')
const app = require('../../src/app')
const { setupDatabase, todoOne, todoTwo, todoOneId, todoTwoId, createTodoTemplate, userOne } = require('../fixtures/db')
const Todo = require('../../src/models/todo')

beforeEach(setupDatabase)

const url = '/todos';

test('Should create a new todo', async () => {

    const body = createTodoTemplate()

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(201)

    const todo = await Todo.findById(response.body._id)
    expect(todo).not.toBeNull()

    expect(todo).toMatchObject(body)
})


test('Should not create a todo if no authorization', async () => {

    const body = createTodoTemplate()

    const response = await request(app)
        .post(url)
        .send(body)
        .expect(401)

    const todo = await Todo.findById(body._id)
    expect(todo).toBeNull()
})


test('Should not create a todo with name more than 20 characters', async () => {

    const body = createTodoTemplate()
    body.name = 'Groceries shopping at Springvale South Shopping Center';

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(400)

    const todo = await Todo.findById(response.body._id)
    expect(todo).toBeNull()
})

test('Should not create a todo with empty name', async () => {

    const body = createTodoTemplate()
    body.name = '       ';

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(400)

    const todo = await Todo.findById(response.body._id)
    expect(todo).toBeNull()
})

test('Should not create a todo with name not provided', async () => {

    const body = createTodoTemplate()
    delete body.name;

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(400)

    const todo = await Todo.findById(response.body._id)
    expect(todo).toBeNull()
})


test('Should create a new todo with default status', async () => {

    const body = createTodoTemplate()
    delete body.status;

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(201)

    const todo = await Todo.findById(response.body._id)
    expect(todo).not.toBeNull()

    expect(todo).toMatchObject({
        ...body,
        status: 'new'
    })
})


test('Should not create a new todo with empty status', async () => {

    const body = createTodoTemplate()
    body.status = ' ';

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(400)

    const todo = await Todo.findById(response.body._id)
    expect(todo).toBeNull()
})

test('Should not create a new todo with invalid status', async () => {

    const body = createTodoTemplate()
    body.status = 'Feliz Navida';

    const response = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(body)
        .expect(400)

    const todo = await Todo.findById(response.body._id)
    expect(todo).toBeNull()
})