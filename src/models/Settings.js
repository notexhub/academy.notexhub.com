import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  logoBase64: { type: String, default: '' },
  sealBase64: { type: String, default: '' },
  isoSealBase64: { type: String, default: '' },
  signatureBase64: { type: String, default: '' },
  watermarkBase64: { type: String, default: '' },
  authorizedByName: { type: String, default: 'NotexHub Admin' },
  authorizedByRole: { type: String, default: 'Authorized Signature' },
  issueDateText: { type: String, default: 'Date of Issue' },
  websiteLogoBase64: { type: String, default: '' },
  bkashNumber: { type: String, default: '' },
  nagadNumber: { type: String, default: '' },
  rocketNumber: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', schema);
