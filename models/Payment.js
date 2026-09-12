import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: String,
  amount: {
    type: Number,
    required: true,
    default: 15000
  },
  feature: {
    type: String,
    enum: ['voice-changer', 'voice-clone'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  qrCode: String,
  transferProof: String,
  verificationTimestamp: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Payment', paymentSchema);
