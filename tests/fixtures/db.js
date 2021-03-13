const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Todo = require('../../src/models/todo')
const User = require('../../src/models/user')


const todoOneId = new mongoose.Types.ObjectId()
const todoTwoId = new mongoose.Types.ObjectId()
const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const createTodoTemplate = () => {
    return {
        name: 'Groceries shopping',
        description: 'At Springvale South Shopping Centre',
        status: 'done',
        owner: userOneId
    }
}

const createUserTemplate = () => {
    return {
        email: 'userTemplate@mail.com',
        firstname: 'Template',
        lastname: 'User',
        password: 'Pass123_456789',
    }
}

const todoOne = {
    _id: todoOneId,
    name: 'Todo one',
    status: 'new',
    owner: userOneId,
}

const todoTwo = {
    _id: todoTwoId,
    name: 'Todo two',
    status: 'new',
    owner: userTwoId
}

const userOne = {
    _id: userOneId,
    email: 'userone@mail.com',
    firstname: 'One',
    lastname: 'User',
    password: 'Pass123_456789',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_TOKEN)
    }]
}

const userTwo = {
    _id: userTwoId,
    email: 'usertwo@mail.com',
    firstname: 'Two',
    lastname: 'User',
    password: 'Pass123_456789',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_TOKEN)
    }]
}

const setupDatabase = async () => {
    await Todo.deleteMany()
    await new Todo(todoOne).save()
    await new Todo(todoTwo).save()
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
}

module.exports = {
    setupDatabase,
    todoOneId,
    todoTwoId,
    todoOne,
    todoTwo,
    userOne,
    userTwo,
    userOneId,
    userTwoId,
    createUserTemplate,
    createTodoTemplate,
}