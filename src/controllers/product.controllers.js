// import mongoose, {isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { uploadOnCloudinary } from "../../../chaiBackend/src/utils/cloudinary.js";
import { Product } from "../models/product.model.js";


const listProduct = asyncHandler(async(req, res) => {
    const {title, description, keyword, status, brand, model, use, material, width, height, weight, price, category} = req.body
    console.log(title, description, keyword, status, brand, model, use, material, width, height, weight, price, category);

    if (!title || !description || !brand || !model || !use || !material || !width || !height || !weight || !price || !category) {
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
    })
    console.log("working 5");

    if (!create) {
        throw new ApiError(400, "unable to create product")
    }

    console.log("working 6");

    return res
    .status(200)
    .json(new ApiResponse(200, create, "product created successfully"))

})

const updateProduct = asyncHandler(async(req, res) => {
    const {title, description, keyword, status, brand, model, use, material, width, height, weight, price, category} = req.body;
    const  {productId} = req.params;
    
    console.log(productId);
    console.log(title, description, keyword, status, brand, model, use, material, width, height, weight, price, category);

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
})

const updateImage = asyncHandler(async(req, res) => {
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
})

const deleteProduct = asyncHandler(async(req, res) => {
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
    const { page = 1, limit = 20, cat = 'all', cate,  sortBy = 'title', sortType = 'asc'} = req.query;

    // Parse limit and calculate number of documents to skip for pagination
    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit;

    const sortStage = sortType === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortStage };

    const parsedQuery = {};

    if (cat !== "all") {
        const categories = cat.split(',');
        console.log(cat);
        parsedQuery.category = { $in: categories };
    }

    // const parsedQuery = JSON.parse(query);

    // Query the database with the specified criteria, sorting, and pagination
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



export {
    listProduct,
    updateProduct,
    updateImage,
    deleteProduct,
    getProduct,
    products,
}