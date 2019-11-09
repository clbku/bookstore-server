import mongoose from "mongoose";

export type DeliveryDocument = mongoose.Document & {
    _id: string;
    orderId: string;
    deliveryUnit: string;
    packageStatus: number;
    history: PackageTrace[];
    status: number;
}

interface PackageTrace {
  timestamp: number;
  log: "string";
}

const deliverySchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  note: String,
  products: [{
    id: String,
    qty: Number
  }],
  shippingUnit: String,
  paymentMethod: String,
  status: Number
}, {timestamps: true});

export const Delivery = mongoose.model<DeliveryDocument>("delivery", deliverySchema);