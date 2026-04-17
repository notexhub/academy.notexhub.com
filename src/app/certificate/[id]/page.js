import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export default async function CertificateUI({ params }) {
  await dbConnect();
  const c = await Certificate.findById(params.id).populate('userId').populate('courseId').lean();
  if(!c || c.status !== 'approved') return <p>Invalid Certificate</p>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '4rem' }}>
      <div style={{
        width: '1000px', height: '700px', backgroundColor: 'white', padding: '10px',
        border: '1px solid #e2e8f0', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        {/* Inner Border */}
        <div style={{ 
          height: '100%', width: '100%', border: '6px solid var(--navy)', padding: '60px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'
        }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
             <span style={{ backgroundColor: 'var(--brand-lime)', padding: '4px 12px', borderRadius: '4px', fontWeight: '900', fontSize: '1.4rem' }}>N</span>
             <span style={{ fontWeight: '800', fontSize: '1.8rem', letterSpacing: '1px' }}>NotexHub</span>
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--navy)', letterSpacing: '4px', margin: '0' }}>CERTIFICATE</h1>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#64748b', letterSpacing: '8px', marginBottom: '60px' }}>OF COMPLETION</h2>
          
          <p style={{ color: '#64748b', fontSize: '1.3rem', marginBottom: '20px' }}>THIS IS TO CERTIFY THAT</p>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--navy)', borderBottom: '2px solid #e2e8f0', marginBottom: '40px', width: '80%', textAlign: 'center', paddingBottom: '10px' }}>
            {c.userId.name}
          </h2>
          
          <p style={{ color: '#64748b', fontSize: '1.3rem', marginBottom: '15px' }}>HAS SUCCESSFULLY COMPLETED THE ONLINE COURSE</p>
          <h3 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--brand-lime)', WebkitTextStroke: '1px var(--navy)' }}>{c.courseId.title}</h3>
          
          {/* Footer of Certificate */}
          <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 40px' }}>
             <div style={{ textAlign: 'center' }}>
               <div style={{ borderBottom: '1px solid var(--navy)', width: '200px', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: '600' }}>
                 {c.issueDate?.toLocaleDateString()}
               </div>
               <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Date of Issue</span>
             </div>
             
             <div style={{ width: '120px' }}>
                <div style={{ width: '80px', height: '80px', border: '2px dashed var(--brand-lime)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--navy)', opacity: 0.5 }}>OFFICIAL SEAL</span>
                </div>
             </div>
             
             <div style={{ textAlign: 'center' }}>
               <div style={{ borderBottom: '1px solid var(--navy)', width: '200px', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: '600', color: 'var(--navy)' }}>
                  NotexHub Administration
               </div>
               <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Signature</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
