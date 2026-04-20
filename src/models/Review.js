import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  photoBase64: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 5 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
