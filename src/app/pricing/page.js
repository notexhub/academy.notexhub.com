import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const plans = [
  {
    name: 'বেসিক', price: '৳ ০', period: 'চিরকালের জন্য', badge: null,
    features: ['সকল ফ্রি কোর্স', 'ভিডিও লেকচার', 'কোর্স প্রগ্রেস ট্র্যাকিং', 'কমিউনিটি ফোরাম'],
    notIncluded: ['প্রিমিয়াম কোর্স', 'সার্টিফিকেট', 'মেন্টর সাপোর্ট'],
    cta: 'ফ্রিতে শুরু করুন', href: '/register', primary: false,
  },
  {
    name: 'মান্থলি', price: '৳ ৯৯৯', period: 'প্রতি মাসে', badge: 'সবচেয়ে জনপ্রিয়',
    features: ['সকল ফ্রি + প্রিমিয়াম কোর্স', 'কোর্স কমপ্লিশন সার্টিফিকেট', 'মেন্টর সাপোর্ট', 'ক্যারিয়ার গাইডেন্স', 'প্রজেক্ট ফিডব্যাক', 'লাইভ Q&A সেশন'],
    notIncluded: [],
    cta: '১ মাস শুরু করুন', href: '/register', primary: true,
  },
  {
    name: 'হাফ ইয়ারলি', price: '৳ ৪,৯৯৯', period: '৬ মাসের জন্য', badge: '১৭% সাশ্রয়',
    features: ['মান্থলি প্ল্যানের সকল সুবিধা', 'সেরা ডিসকাউন্ট', 'অফলাইন ডাউনলোড', 'প্রায়োরিটি সাপোর্ট'],
    notIncluded: [],
    cta: '৬ মাস শুরু করুন', href: '/register', primary: false,
  },
];

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #111827)', padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <div className="label" style={{ background: 'rgba(198,241,53,0.1)', color: 'var(--lime)', borderColor: 'rgba(198,241,53,0.25)' }}>প্রাইসিং</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>সঠিক প্ল্যান বেছে নিন</h1>
          <p style={{ color: '#94a3b8', fontSize: 'var(--text-lg)', maxWidth: 520, margin: '0 auto' }}>সাশ্রয়ী মূল্যে বিশ্বমানের শিক্ষা — যেকোনো বাজেটে শিখুন।</p>
        </div>
      </section>

      <section style={{ background: 'var(--gray-50)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
            {plans.map((p, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: p.primary ? '2px solid var(--lime)' : '1px solid var(--gray-200)', padding: '2.5rem', position: 'relative', boxShadow: p.primary ? '0 20px 40px rgba(198,241,53,0.15)' : 'var(--shadow-sm)' }}>
                {p.badge && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--lime)', color: 'var(--navy)', padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 800, whiteSpace: 'nowrap' }}>{p.badge}</div>}
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{p.name}</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{p.price}</span>
                  <span style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)', marginLeft: '0.4rem' }}>/ {p.period}</span>
                </div>
                <Link href={p.href} className={`btn btn-block btn-lg ${p.primary ? 'btn-lime' : 'btn-outline'}`} style={{ marginBottom: '2rem' }}>{p.cta}</Link>
                <div className="divider" />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {p.features.map(f => <li key={f} style={{ display: 'flex', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}><span style={{ color: '#16a34a' }}>✓</span>{f}</li>)}
                  {p.notIncluded.map(f => <li key={f} style={{ display: 'flex', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--gray-300)', textDecoration: 'line-through' }}><span>✗</span>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
