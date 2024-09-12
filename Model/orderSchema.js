import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({}, { collection: "shopifyOrders" });
const Orders = mongoose.model("Orders", ordersSchema);

export default Orders;
