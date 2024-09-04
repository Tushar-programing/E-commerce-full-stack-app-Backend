// import mongoose, {isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { uploadOnCloudinary } from "../../../chaiBackend/src/utils/cloudinary.js";
import { Product } from "../models/product.model.js";


const listProduct = asyncHandler(async(req, res) => {

    if (req?.user?.email === "ttushar476@gmail.com") {
        const {title, description, keyword, status, brand, model, use, material, width, height, weight, price, category, subCategory, instagram} = req.body
        console.log(title, description, keyword, status, brand, model, use, material, width, height, weight, price, category, subCategory, instagram);

        const instaBool = instagram === "true";

        if (!title || !description || !brand || !model || !use || !material || !width || !height || !weight || !price || !category ) {
            throw new ApiError(400, "All fields are required")
        }

        if (!(status === "false" || status === "true")) {
            throw new ApiError(400, "Status fields are required")
        }

        const owner = req.user?._id
        console.log("owner", owner);

        const files = req.files;
        console.log(files);
        if (!files) {
            throw new ApiError(400, "please upload images")
        }

        if (files.length > 10) {
            throw new ApiError(400, "Can't upload more than 10 images")
        }

        const image = [];

        for (const file of files) {

            const localFilePath = file.path

            const result = await uploadOnCloudinary(localFilePath)

            if (result && result.url) {
                image.push(result.url)
            } else {
                throw new ApiError(400, "unable to upload images on cloudinary")
            }
        }

        console.log("working 3");

        if (!image) {
            throw new ApiError(400, "Image is not uploaded on cloudinary");
        }
        console.log("working 4");

        const create = await Product.create({
            title,
            description,
            keyword,
            status,
            brand,
            model,
            use,
            material,
            width,
            height,
            weight,
            price,
            image,
            owner,
            category,
            subCategory,
            instagram : instaBool,
        })
        console.log("working 5");

        if (!create) {
            throw new ApiError(400, "unable to create product")
        }

        console.log("working 6");

        return res
        .status(200)
        .json(new ApiResponse(200, create, "product created successfully"))
    } else {
        throw new ApiError(400, "Access Denied!")
    }
    
})

const updateProduct = asyncHandler(async(req, res) => {

    if (req?.user?.email === "ttushar476@gmail.com") {

        const {title, description, keyword, status, brand, model, use, material, width, height, weight, price, category, subCategory, instagram} = req.body;
        const  {productId} = req.params;
        
        console.log(productId);
        console.log(title, description, keyword, status, brand, model, use, material, width, height, weight, price, category, subCategory, instagram);

        const instaBool = instagram === "true";

        if (!title || !description || !keyword || !brand || !model || !use || !material || !width || !height || !weight || !price || !category) {
            throw new ApiError(400, "All fields are required")
        }

        if (!(status === "false" || status === "true")) {
            throw new ApiError(400, "Status fields are required")
        }

        if (!productId) {
            throw new ApiError(400, "productId not found")
        }

        const exist = await Product.findById(productId)
        if (!exist) {
            throw new ApiError(400, "No product found with this productId")
        } else if (exist.owner.toString() !== req.user._id.toString()) {
            console.log(exist.owner.toString(), req.user._id.toString());
            throw new ApiError(400, "Unauthorized user for editing this product");
        }

        const files = req.files;

        if (!files) {
            throw new ApiError(400, "First choose some files")
        }

        let image;

        if (files && files.length > 0) {
            image = [];

            for (const file of files) {
                const localFilePath = file.path;
                const upload = await uploadOnCloudinary(localFilePath);

                if (upload && upload.url) {
                    console.log(upload.url);
                    image.push(upload.url);
                } else {
                    throw new ApiError(400, "Unable to upload images on Cloudinary");
                }
            }
        } else {
            image = exist.image;
        }

        const update = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    title,
                    description,
                    keyword,
                    status,
                    brand,
                    model,
                    use,
                    material,
                    width,
                    height,
                    weight,
                    price,
                    image,
                    category,
                    subCategory,
                    instagram : instaBool,
                }
            },
            {new: true}
        )

        if (!update) {
            throw new ApiError(400, "Unbale to update the product");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, update, "The product has been updated successfully"));
    } else {
        throw new ApiError(400, "Acess Denied!")
    }
    
})

const updateImage = asyncHandler(async(req, res) => {
    if (req?.user?.email === "ttushar476@gmail.com") {
        const {productId} = req.params;

        if (!productId) {
            throw new ApiError(400, "Unable to get product detail")
        }

        const files = req.files;

        if (!files) {
            throw new ApiError(400, "First choose some files")
        }

        const image = [];

        for (const file of files) {

            const localFilePath = file.path;
            const upload = await uploadOnCloudinary(localFilePath);

            if (upload && upload.url) {
                console.log(upload.url);
                image.push(upload.url);
            } else {
                throw new ApiError(400, "unable to upload images on cloudinary")
            }
        }

        if (!image) {
            throw new ApiError(400, "Image has uploaded but not found")
        }

        const update = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    image,
                }
            },
            {new: true}
        )

        if (!update) {
            throw new ApiError(404, "Unable to  update the product");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, update, "product updated  successfully"));
    } else {
        throw new ApiError(400, "Access Denied!")
    }
    
})

const deleteProduct = asyncHandler(async(req, res) => {
    if (req?.user?.email === "ttushar476@gmail.com") {
        const {productId} = req.params;

        if (!productId) {
            throw new ApiError(400, "Please provide a valid id");
        }

        const del = await Product.findByIdAndDelete(productId);

        if (!del) {
            throw new ApiError(400, "unable to delete this product");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "product deleted successfully"))
    } else {
        throw new ApiError(400, "Access Denied!")
    }
    
})

const getProduct = asyncHandler(async(req, res) => {

    const {productId} = req.params;
    // console.log(productId);

    if (!productId) {
        throw new  ApiError(400, "product id is not found");
    }

    const get = await Product.findById({_id : productId})

    if (!get) {
        throw new ApiError(400, "No data found for this product Id");
    }

    return res
    .status(201)
    .json(new ApiResponse(201, get, "Product Data fetched successfully"))
})

const products = asyncHandler(async (req, res) => {
    const { page = '', limit = '', cat = " ", sortBy = 'price', sortType = 'des',  minPrice = '10', maxPrice = '200000', searchQuery = ''} = req.query;
    // console.log(sortBy, sortType, minPrice, maxPrice);

    // Parse limit and calculate number of documents to skip for pagination
    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit;

    const sortStage = sortType === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortStage };

    const parsedQuery = {};
    if (cat !== " ") {
        const categories = cat.split(',');
        console.log(cat);
        parsedQuery.category = { $in: categories };
    }

    if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        parsedQuery.title = regex;
    }


    if (minPrice || maxPrice) {
        parsedQuery.price = {};
        if (minPrice) {
            parsedQuery.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
            parsedQuery.price.$lte = parseFloat(maxPrice);
        }
    }


    const products = await Product.find(parsedQuery)
        .select('-owner')
        .sort(sortObj)
        .skip(pageSkip)
        .limit(parsedLimit);     // want to addd select by "-owner" todo

    if (!products) {
        throw new ApiError(400, "No product data found");
    }

    return res
        .status(200)
        .json(new ApiResponse(201, products, "Product data found"));
    
});

const getYourProduct = asyncHandler(async(req, res) => {

    if (req?.user?.email === "ttushar476@gmail.com") {
        const get = await Product.find({owner: req.user._id})

        if (!get) {
            throw new ApiError(400, "unable to get products")
        }

        return res
        .status(200)
        .json(new ApiResponse(201, get, "Product data found"));
    } else {
        throw new ApiError(400, "Access Denied!")
    }
    
})



export {
    listProduct,
    updateProduct,
    updateImage,
    deleteProduct,
    getProduct,
    products,
    getYourProduct,
}