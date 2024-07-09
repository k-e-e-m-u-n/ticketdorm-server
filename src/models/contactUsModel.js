import mongoose from 'mongoose';

const contactUs = mongoose.Schema({
    firstName: {
        type: 'string'
    },
    lastName: {
        type: 'string'
    },
    email: {
        type: 'string'
    },
    message: {
        type: 'string'
    }
})

const Contact = mongoose.model('Contact',contactUs)

export default Contact