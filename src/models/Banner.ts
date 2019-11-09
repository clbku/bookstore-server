import mongoose from "mongoose";

export type BannerDocument = mongoose.Document & {
    _id: string;
    image: string;
    link: string;
}

const bannerSchema = new mongoose.Schema({
  image: String,
  link: String
});

export const Banner = mongoose.model<BannerDocument>("banner", bannerSchema);