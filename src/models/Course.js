import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Development' },
  isFree: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  price: { type: Number, default: 1500 },
  bannerBase64: { type: String, default: '' },
  whatYouLearn: [{ type: String }],
  resources: [{ 
    title: { type: String, required: true },
    fileData: { type: String, required: true },
    fileName: { type: String, default: '' }
  }],
  modules: [ModuleSchema],
  subscriptionOnly: { type: Boolean, default: false },
  instructor: {
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    designation: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
