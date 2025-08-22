const mongoose = require("mongoose");


const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Number,
        required: true,
    },
});

const Product = mongoose.model("Product", ProductModel);
module.exports = {Product};