import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
// import { upload } from "../../../chaiBackend/src/middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { listProduct } from "../controllers/product.controllers.js";

const router = Router();

router.route("/listProduct").post(verifyJWT, upload.single("image"), listProduct);

export default router;