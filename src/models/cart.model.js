import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    {timestamps: true}
)

export const Cart = mongoose.model("Cart", cartSchema)
