const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: {
            type: Number
        },
        images: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            type: Boolean,
            required: false
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);