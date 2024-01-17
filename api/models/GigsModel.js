import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: String,
  description: String,
  category: String,
  subCategory: String,
  deliveryTime: Number,
  revisions: Number,
  features: [String],
  price: Number,
  shortDesc: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  images: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WishList' }],
});

const Gig = mongoose.model('Gig', gigSchema);

export default  Gig;
