import mongoose,{model, Schema} from "mongoose";

const wishlistSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

export const Wishlist = mongoose.model("Wishlist", wishlistSchema)