import { Request } from "express";
import asyncHandler from "express-async-handler";
import { Product } from "../models";

//@desc   Fetch all products
//@route  GET /api/products
//@access Public
//TODO: Different pages
const getProducts = asyncHandler(async (_req, res) => {
    const products = await Product.find();
    res.json(products);
});

//@desc   Fetch single product
//@route  GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id!);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

//@desc    Delete a product
//@route   DELETE /api/products/:id
//@access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product removed" });
    } catch (error) {
        res.status(404);
        throw new Error("Product not found");
    }
});

//@desc    Create a new product
//@route   POST /api/products
//@access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { brand, category, description, image, name, price } = req.body;

    const product = new Product({
        brand,
        category,
        description,
        image,
        name,
        price,
        user: req.user,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

//@desc    Update a product
//@route   PUT /api/products/:id
//@access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const tmpProduct = {
            name: req.body.name ? req.body.name : product.name,
            brand: req.body.brand ? req.body.brand : product.brand,
            category: req.body.category ? req.body.category : product.category,
            countInStock: req.body.countInStock
                ? req.body.countInStock
                : product.countInStock,
            description: req.body.description
                ? req.body.description
                : product.description,
            image: req.body.image ? req.body.image : product.image,
            price: req.body.price ? req.body.price : product.price,
            rating: req.body.rating ? req.body.rating : product.rating,
        };
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            tmpProduct
        );
        res.status(200).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

//@desc    Create new review
//@route   POST /api/products/:id/reviews
//@access  Private
const createProductReview = asyncHandler(
    async (
        req: Request<{ id: String }, {}, { rating: number; comment: string }>,
        res
    ) => {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        // TODO: check if user already reviewed the product

        if (product) {
            const review = {
                name: "server",
                rating: Number(rating),
                comment,
                user: "62b25b83a0848f6946c786ce", // TODO: change this
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: "Review added" });
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    }
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (_req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.send(products);
});

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
};
