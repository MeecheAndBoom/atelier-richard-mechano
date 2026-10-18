import { Schema, model, models } from "mongoose";

/**
 * Shop taxonomy tiles — categories, makes, brands and models all live here
 * so the admin's Categories screen can manage every filter chip in one place.
 */
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["category", "make", "brand", "model"],
      default: "category",
      index: true,
    },
    image: { type: String, default: "" },
    /** Optional value used when the tile label differs from the filter key. */
    href: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CategorySchema.index({ name: 1, type: 1 }, { unique: true });

export const Category = models.Category ?? model("Category", CategorySchema);
