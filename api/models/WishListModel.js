import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
  },
});

const WishList = mongoose.model('WishList', wishListSchema);

export default  WishList;
