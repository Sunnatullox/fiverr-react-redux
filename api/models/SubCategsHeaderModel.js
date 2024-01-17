import mongoose from 'mongoose';

const subCategoryHeaderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  categorys: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subCategorys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  }],
});

const SubCategoryHeader = mongoose.model('SubCategoryHeader', subCategoryHeaderSchema);

export default  SubCategoryHeader;
