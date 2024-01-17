import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: Number,
  reviewText: String,
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default  Review;
