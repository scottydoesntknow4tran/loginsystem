const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name:{ 
        type: String,
        required: true
    },
    email:{ 
        type: String,
        required: true
    },
    password:{ 
        type: String,
        required: true
    }
}, {timestamps: true })

const Authors = mongoose.model('Author',authorSchema);

module.exports = Authors;