import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
// import { upload } from "../../../chaiBackend/src/middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteProduct, getProduct, listProduct, products, updateImage, updateProduct } from "../controllers/product.controllers.js";

const router = Router();

router.route("/listProduct").post(verifyJWT, upload.array("images", 10), listProduct);

router.route("/updateProduct/:productId").post(verifyJWT, updateProduct);

router.route("/updateImage/:productId").post(verifyJWT, upload.array("images", 10), updateImage);

router.route("/deleteProduct/:productId").post(verifyJWT, deleteProduct)

router.route("/getProduct/:productId").post(verifyJWT, getProduct);

router.route("/products").post(verifyJWT, products)

export default router;