const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    username: String,
    email: String,
    PWAId: String,
    rating: Number,
    review: String
})


module.exports = mongoose.model('reviews', reviewSchema, 'reviews')
