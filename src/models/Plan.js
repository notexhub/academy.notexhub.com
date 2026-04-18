import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true }, // numeric price for calculation
  displayPrice: { type: String, required: true }, // e.g. "৳ ৯৯৯"
  periodText: { type: String, required: true }, // e.g. "প্রতি মাসে"
  periodDays: { type: Number, required: true }, // e.g. 30
  badge: { type: String, default: '' }, // e.g. "সবচেয়ে জনপ্রিয়"
  features: [{ type: String }],
  notIncluded: [{ type: String }],
  cta: { type: String, default: 'শুরু করুন' },
  primary: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Plan || mongoose.model('Plan', schema);
