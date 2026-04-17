import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  logoBase64: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
