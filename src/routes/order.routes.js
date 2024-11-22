import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createCartOrder, createOrder, customerCancel, getOrderById, ownerOrder, ownerReturn, returnStatus, updateOrder, userOrder } from "../controllers/order.controller.js";


const  router = Router();

router.route("/createOrder/:product").post(verifyJWT, createOrder)

router.route("/updateOrder/:orderId").post(verifyJWT, updateOrder)

router.route("/returnStatus/:orderId").post(verifyJWT, returnStatus)

router.route("/userOrder").post(verifyJWT, userOrder)

router.route("/ownerOrder").post(verifyJWT, ownerOrder)

router.route("/ownerReturn").post(verifyJWT, ownerReturn)

router.route("/customerCancel").post(verifyJWT, customerCancel)

router.route("/createCartOrder").post(verifyJWT, createCartOrder)

router.route("/getOrderById/:orderId").post(verifyJWT, getOrderById)

export default router;