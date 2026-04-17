import Link from 'next/link';

export default function Hero() {
  const stats = [['১২,০০০+', 'শিক্ষার্থী'], ['৬০+', 'কোর্স'], ['৯৮%', 'সন্তুষ্টি'], ['৫০০+', 'গ্রাজুয়েট']];
  const previews = [
    { icon: '💻', t: 'কমপ্লিট ওয়েব ডেভেলপমেন্ট', s: '৩,২০০+ শিক্ষার্থী', b: 'জনপ্রিয়', bc: 'var(--lime)' },
    { icon: '🎨', t: 'গ্রাফিক্স ডিজাইন মাস্টারক্লাস', s: '২,৪০০+ শিক্ষার্থী', b: 'ট্রেন্ডিং', bc: '#60a5fa' },
    { icon: '📱', t: 'ডিজিটাল মার্কেটিং প্রো', s: '১,৮০০+ শিক্ষার্থী', b: 'নতুন', bc: '#f472b6' },
  ];

  return (
    <section style={{ background: 'linear-gradient(135deg, #0a1628 0%, #111827 50%, #0d2137 100%)', padding: '90px 0 100px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'rgba(198,241,53,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(198,241,53,0.03)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(198,241,53,0.02)', pointerEvents: 'none' }} />

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Left */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(198,241,53,0.1)', border: '1px solid rgba(198,241,53,0.25)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: 8, height: 8, background: 'var(--lime)', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#c6f135', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em' }}>🇧🇩 বাংলাদেশের #১ লার্নিং প্ল্যাটফর্ম</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            স্বপ্নের ক্যারিয়ার <br />
            <span style={{ color: 'var(--lime)' }}>গড়ে তুলুন</span>
            <br />দক্ষ মেন্টরদের সাথে
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 'var(--text-lg)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: 480 }}>
            হাতে–কলমে প্রজেক্ট এবং বাস্তব অভিজ্ঞতা দিয়ে দেশের সেরা কোম্পানিতে চাকরি পান।
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/courses" className="btn btn-lime btn-xl">কোর্স দেখুন →</Link>
            <Link href="/pricing" className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>প্ল্যান দেখুন</Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {stats.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--lime)' }}>{n}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: '#64748b', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Course Preview Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: '#64748b', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>জনপ্রিয় কোর্সসমূহ</p>
          {previews.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.t}</div>
                <div style={{ color: '#64748b', fontSize: 'var(--text-xs)' }}>{p.s}</div>
              </div>
              <span style={{ background: p.bc, color: p.bc === 'var(--lime)' ? 'var(--navy)' : 'white', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>{p.b}</span>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem', background: 'rgba(198,241,53,0.08)', border: '1px solid rgba(198,241,53,0.2)', borderRadius: 'var(--radius-md)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🎓</span>
            <div>
              <p style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: 600 }}>এই সপ্তাহে ৩৪০ জন এনরোল করেছেন</p>
              <p style={{ color: '#c6f135', fontSize: 'var(--text-xs)' }}>Limited seat available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
