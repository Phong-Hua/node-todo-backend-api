const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const passwordValidator = require('password-validator')
const jwt = require('jsonwebtoken')
const Todo = require('./todo')

const createPasswordSchema = () => {
    const passwordSchema = new passwordValidator();
    passwordSchema.is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

    return passwordSchema;
}

const passwordSchema = createPasswordSchema();


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('The email is not valid.')
        }
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error('Password should not contains the word "password".')
            if (!passwordSchema.validate(value))
                throw new Error(`Password must be 8 characters, has at least one uppercase, one lowercase, one digit and no space.`);
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
        // no need to perform validation because multer take care of it
    }
})

userSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function(next) {
    const user = this;

    // Check if password is hashed or not.
    // If it is already hashed, we don't want to hash again
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next();
})

userSchema.pre('remove', async function (next) {
    const user = this;
    await Todo.deleteMany({owner: user._id})
    next();
})

userSchema.methods.toJSON = function() {

    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar; // delete it for performance

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN, {expiresIn: '7 days'})
    user.tokens.push({token})
    await user.save()
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error('Unable to login')  // we don't want the error to be specific for security reason

    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched)
        throw new Error('Unable to login')
    
    return user;
}

const User = mongoose.model('User', userSchema)

module.exports = User