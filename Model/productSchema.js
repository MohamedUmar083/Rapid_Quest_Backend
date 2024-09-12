import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {},
  { collection: "shopifyProducts" }
);
const Products = mongoose.model("Products", productsSchema);

export default Products;
