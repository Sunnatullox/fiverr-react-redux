import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  fullname: String,
  description: String,
  profileImage: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    enum: ['ADMIN', 'SELLER', 'BUYER'],
    default: 'BUYER',
  },
  isProfileInfoSet: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  OAuth:{
    type:Boolean,
    default: false,
  },
  gigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  messagesSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message',  }],
  messagesReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', }],
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WishList' }],
});

const User = mongoose.model('User', userSchema);

export default  User;