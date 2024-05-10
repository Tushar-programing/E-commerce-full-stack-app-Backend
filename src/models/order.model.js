import mongoose,{model, Schema} from "mongoose";
// import { User } from "./user.model.js";

const orderSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        quantity: {
            type: Number,
            required: true,
        },
        adress: {
            type: Schema.Types.ObjectId,
            ref: "Adress"
        },
        status: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        adress1: {
            type: String,
            required: true
        },
        adress2: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true
        }
        
        // price: {
        //     type: Number,
        //     required: true,
        // }
    },
    {
        timestamps: true,
    }
)

export const Order = mongoose.model("Order", orderSchema)