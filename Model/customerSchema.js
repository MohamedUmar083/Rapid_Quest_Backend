import mongoose from "mongoose";

const customersSchema = new mongoose.Schema(
  {},
  { collection: "shopifyCustomers" }
);
const Customers = mongoose.model("Customers", customersSchema);

export default Customers;
