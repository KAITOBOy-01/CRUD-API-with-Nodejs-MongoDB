require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
});

app.use(express.json());

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product',productSchema)

// This create a new product 

app.post('/products', async (req, res) => {
    try {
        const  newProduct = new Product(req.body);
        const  saveProduct =  await newProduct.save();
        res.status(201).json(saveProduct);
    }catch (error) {
        res.status(400).json({ message: error.message})
    }
})
// Get all proucts
app.get('/products',async (req,res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// Get product by ID
app.get('/products/:id',async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product);
    }catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// Update product by ID (PATCH / products/:id)
app.patch('/products/:id',async (req,res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(updatedProduct);
    }catch (error) {
        res.status(400).json({ message: error.message})
    }
})
// Delete product by ID (DELETE / products/:id)
app.delete('/products/:id',async (req,res) => {
    try {
        const DeleteProduct = await Product.findByIdAndDelete(req.params.id);
        if (!DeleteProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json({ message: ' Product deleted successfully'});
    }catch (error) {
        res.status(500).json({ message: error.message})
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});