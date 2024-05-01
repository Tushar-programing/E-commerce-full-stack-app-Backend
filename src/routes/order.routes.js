import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createOrder, ownerOrder, updateOrder, userOrder } from "../controllers/order.controller.js";


const  router = Router();

router.route("/createOrder/:product").post(verifyJWT, createOrder)

router.route("/updateOrder/:orderId").post(verifyJWT, updateOrder)

router.route("/userOrder").post(verifyJWT, userOrder)

router.route("/ownerOrder").post(verifyJWT, ownerOrder)

export default router;