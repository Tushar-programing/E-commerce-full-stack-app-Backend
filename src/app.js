import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
import { ApiError } from "./utils/apiError.js";
dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// console.log(process.env.CORS_ORIGIN);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
import product from "./routes/product.routes.js"
import adress from "./routes/adress.routes.js"
import cart from "./routes/cart.routes.js"
import order from "./routes/order.routes.js"
import wishlist from "./routes/wish.routes.js"
import buyNow from "./routes/buyNow.routes.js";

// console.log("app.js working");
app.use("/api/v1/users", userRouter)

app.use("/api/v1/product", product)

app.use("/api/v1/adress", adress)

app.use("/api/v1/cart", cart)

app.use("/api/v1/order", order)

app.use("/api/v1/wishlist", wishlist)

app.use("/api/v1/buyNow", buyNow)

// app.use((err, req, res, next) => {
//     if (err instanceof ApiError) {
  
//     //   console.log(err.message)
//       return res.status(err.statusCode).json({
//         statusCode: err.statusCode,
//         message: err.message,
//         success: false
  
//       });
//     }
//     // console.log(err)
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong on the server',
//     });
//   });

export { app }