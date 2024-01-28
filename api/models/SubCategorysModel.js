import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: String,
  description: String,
  slug: String,
  logo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subCategHeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategoryHeader',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default  SubCategory;
