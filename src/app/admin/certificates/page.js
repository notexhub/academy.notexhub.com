import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import User from '@/models/User';
import Course from '@/models/Course';
import CertificateManager from './CertificateManager';

export const dynamic = 'force-dynamic';

export default async function AdminCertificates() {
  await dbConnect();
  // Ensure models are registered
  User.schema; Course.schema;
  
  const certs = await Certificate.find({ status: 'pending' })
    .populate('userId', 'name email')
    .populate('courseId', 'title')
    .lean();
    
  const sCerts = certs.map(c => ({
    _id: c._id.toString(),
    user: c.userId?.name,
    email: c.userId?.email,
    course: c.courseId?.title,
    status: c.status
  }));

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>সার্টিফিকেটস অ্যাপ্রুভাল প্যানেল</h1>
      <CertificateManager initialCerts={sCerts} />
    </div>
  );
}
