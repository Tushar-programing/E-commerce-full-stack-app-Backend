import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { uploadOnCloudinary } from "../../../chaiBackend/src/utils/cloudinary.js";
import { Product } from "../models/product.model.js";

const listProduct = asyncHandler(async(req, res) => {
    const {title, description, keyword, status, brand, model, use, material, width, height, weight, price} = req.body
    console.log(title, description, keyword, status, brand, model, use, material, width, height, weight, price);

    const owner = req.user?._id
    console.log("owner", owner);

    // const files = req.file;
    // console.log(files);

    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "no files available")
    }
    // const image = [];

    // for (const file of files) {
    //     const localFilePath = file.path
    //     console.log(file.path);
        const result = await uploadOnCloudinary(avatarLocalPath)
        console.log(result);

        // if (result && result.url) {
        //     image.push(result.url)
        // } else {
        //     throw new ApiError(400, "unable to upload on cloudinary")
        // }
    // }



        // console.log("file0", files[0].destination);
    // console.log("file1", files[1]);
    // console.log("file2", files[2]);
    // console.log("file3", files[3]);



})

export {
    listProduct,
}