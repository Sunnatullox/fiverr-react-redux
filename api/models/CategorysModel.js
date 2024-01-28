import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: {
    type: String,
    unique: true,
  },
  slug: String,
  logo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subCategHeader: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategoryHeader',
  }],
  subCategorys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  }],
});

const Category = mongoose.model('Category', categorySchema);

export default  Category;
