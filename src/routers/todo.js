const express = require('express')
const Todo = require('../models/todo')
const User = require('../models/user')
const auth = require('../middlewares/auth')

const router = express.Router()

/**
 * Get all todos by user.
 * Apply status filtering,
 * limit, skip and sortBy.
 */
router.get('/todos', auth, async (req, res) => {

    const status = req.query.status;
    const valid = Todo.isStatusValid(status);
    if (status && !valid)   // if status is provide and not valid
        return res.status(400).send({ error: 'Todo status is invalid.' })

    const match = {}
    if (status)
        match.status = status

    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)

    const sort = {}
    if (req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {

        const user = req.user;
        await user.populate({
            path: 'todos',
            match,
            options: {
                limit,
                skip,
                sort,
            }
        }).execPopulate();
        res.status(200).send(user.todos)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Create a todo
 */
router.post('/todos', auth, async (req, res) => {
    const todo = new Todo(req.body)
    todo.owner = req.user._id
    try {
        await todo.save()
        res.status(201).send(todo)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Get a todo by id
 */
router.get('/todos/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const todo = await Todo.findOne({ _id, owner: req.user._id })
        if (!todo)
            return res.status(404).send()
        await todo.populate('owner').execPopulate();
        res.send(todo)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/todos/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const allowUpdates = ['name', 'description', 'status']
    const updates = Object.keys(req.body)
    const isUpdateValid = updates.length > 0 && updates.every(update => allowUpdates.includes(update));

    if (!isUpdateValid)
        return res.status(400).send({ 'error': 'Invalid updates.' })

    try {
        const todo = await Todo.findOne({ _id, owner: req.user._id })
        if (!todo)
            return res.status(404).send()

        Object.assign(todo, req.body)
        await todo.save()
        res.send(todo)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/todos/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const todo = await Todo.findOne({ _id, owner: req.user._id })
        if (!todo)
            return res.status(404).send()

        await todo.remove()
        res.send(todo)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router