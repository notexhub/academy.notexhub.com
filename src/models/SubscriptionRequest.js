import mongoose from 'mongoose';

const SubscriptionRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['bkash', 'nagad', 'rocket'], required: true },
  transactionId: { type: String, required: true, unique: true },
  senderNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminComment: { type: String, default: '' },
  period: { type: Number, required: true }, // in days
}, { timestamps: true });

export default mongoose.models.SubscriptionRequest || mongoose.model('SubscriptionRequest', SubscriptionRequestSchema);
