import mongoose, { Schema } from "mongoose";

const buyNowSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId, // Reference to the product
      ref: "Product", // Assuming you have a Product model
    },
    buyer_id: {
      type: Schema.Types.ObjectId, // Reference to the buyer
      ref: "User", // Assuming you have a User model
    },
    repeat: {
      type: Number, // Number of times this product was purchased by the buyer
      default: 1, // Starts at 1 for a new purchase
      trim: true,
    },
  },
  { timestamps: true }
);

export const BuyNow = mongoose.model("BuyNow", buyNowSchema);
