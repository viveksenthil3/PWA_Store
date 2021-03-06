const mongoos = require('mongoose')


const pwaSchema = new mongoos.Schema({
    username: {
        type: String,
        required: true
    },
    PWAName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    logo: {
        type: Object,
        required: true
    },
    samplePics: {
        type: Array,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoos.model('pwa', pwaSchema);