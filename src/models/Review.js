import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  photoBase64: { type: String },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
