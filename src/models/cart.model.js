import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        userid: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        quantity: {
            type: Number,
            required: true,
        }
    },
    {timestamps: true}
)