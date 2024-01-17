import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentIntent: {
    type: String,
    unique: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isNotification:{
    type: Boolean,
    default:true
  },
  orderFile:[{
    file:String,
    fileTitle:String
  }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
  },
  price: Number,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const Order = mongoose.model('Order', orderSchema);

export default  Order;
