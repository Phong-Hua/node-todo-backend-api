const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middlewares/auth')


const router = express.Router()

// Create an instance, the file will be upload to avatars folder
const avatarUpload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error('Please upload jpg, jpeg or png file'))
        cb(undefined, true) // file is valid
    }
})

router.get('/users', async (req, res)=> {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Login
 */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        
        // await user.populate('todos').execPopulate();
        // const todos = user.todos;
        res.send({user, token})
        // res.send({todos, token})
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

/**
 * Update user.
 * Find user by Id, update the user then save => make sure it goes through the middleware of hashing password.
 */
router.patch('/users', auth, async (req, res) => {

    const allowUpdates = ['firstname', 'lastname', 'password'];
    const updates = Object.keys(req.body);
    const isUpdateValid = updates.length > 0 && updates.every(update => allowUpdates.includes(update));
    if (!isUpdateValid)
        return res.status(400).send({error: 'Invalid updates.'})
    
    try {
        const user = await User.findById(req.user._id)
        if (!user)
            return res.status(404).send()

        Object.assign(user, req.body)
        await user.save()
        res.send(user)

    }
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Logout
 */
router.post('/users/logout', auth, async (req, res) => {
    try {

        // user logout, delete all tokens
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users', auth, async (req, res) => {
    try {
        await req.user.delete();
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/me/avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
    
    // give sharp the original image buffer then it will resize it and convert to buffer again
    const buffer = await sharp(req.file.buffer)
            .resize({width: 250, height: 250})
            .png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        // set response header
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router