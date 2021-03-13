const mongoose = require('mongoose')

const status = ['new', 'progressing', 'done']

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        default: status[0],
        validate(value) {
            if (!status.includes(value))
                throw new Error("The status need to be either 'new', 'progressing' or 'done'.")
        }
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

todoSchema.statics.isStatusValid = function(stat) {
    return status.includes(stat);
}

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo