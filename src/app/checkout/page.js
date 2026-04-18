'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, ShieldCheck, ArrowLeft, Loader2, Smartphone, Send, Landmark } from 'lucide-react';

const plans = {
  'monthly': { name: 'মান্থলি', price: 999, period: 30, title: '১ মাস আনলিমিটেড এক্সেস' },
  'half-yearly': { name: 'হাফ ইয়ারলি', price: 4999, period: 180, title: '৬ মাস আনলিমিটেড এক্সেস' }
};


function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planSlug = searchParams.get('plan');
  
  const [plan, setPlan] = useState(null);
  const [method, setMethod] = useState('');
  const [trxId, setTrxId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [numbers, setNumbers] = useState({});
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!planSlug) {
      router.push('/pricing');
      return;
    }
    
    Promise.all([
      fetch('/api/public/settings').then(res => res.json()),
      fetch('/api/public/plans').then(res => res.json())
    ]).then(([settingsData, plansData]) => {
      // Set settings
      const activeNumbers = {};
      if (settingsData.bkashNumber) activeNumbers.bkash = { label: 'বিকাশ পার্সোনাল', number: settingsData.bkashNumber };
      if (settingsData.nagadNumber) activeNumbers.nagad = { label: 'নগদ পার্সোনাল', number: settingsData.nagadNumber };
      if (settingsData.rocketNumber) activeNumbers.rocket = { label: 'রকেট পার্সোনাল', number: settingsData.rocketNumber };
      setNumbers(activeNumbers);
      if (activeNumbers.bkash) setMethod('bkash');
      else if (activeNumbers.nagad) setMethod('nagad');
      else if (activeNumbers.rocket) setMethod('rocket');

      // Set plan
      const selectedPlan = Array.isArray(plansData) ? plansData.find(p => p.slug === planSlug) : null;
      if (!selectedPlan) {
        router.push('/pricing');
      } else {
        setPlan(selectedPlan);
      }
      setPageLoading(false);
    }).catch((e) => {
      console.error(e);
      setPageLoading(false);
    });
  }, [planSlug, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!method) { setError('Payment method not selected'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/subscription/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: plan.name,
          amount: plan.price,
          method,
          transactionId: trxId,
          senderNumber: phone,
          period: plan.periodDays
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 3000);
      } else {
        setError(data.message || 'সাবমিট করতে সমস্যা হয়েছে');
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
    setLoading(false);
  };

  if (pageLoading) {
     return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#94a3b8]" /></div>;
  }

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, padding: '3rem', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ width: 80, height: 80, background: '#dcfce7', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>পেমেন্ট সফলভাবে জমা হয়েছে!</h2>
          <p style={{ color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '2rem' }}>আমাদের টিম আপনার ট্রানজেকশনটি যাচাই করছে। অনুমোদিত হলে আপনি আপনার ড্যাশবোর্ডে নোটিফিকেশন পাবেন এবং সকল কোর্সের এক্সেস পাবেন।</p>
          <div className="alert alert-info" style={{ background: '#f0f9ff', borderColor: '#bae6fd', color: '#0369a1' }}>
            আপনাকে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
          </div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: 1000 }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> ফিরে যান
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Instructions */}
          <div>
            <div style={{ background: 'white', borderRadius: 24, padding: '2.5rem', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                <div style={{ width: 40, height: 40, background: 'var(--lime-light)', color: 'var(--navy)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Landmark size={20} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>পেমেন্ট পদ্ধতি</h1>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>ম্যানুয়ালি পেমেন্ট সম্পন্ন করে নিচের ফর্মটি পূরণ করুন</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: '1rem', color: 'var(--navy)' }}>ধাপ ১: টাকা পাঠান (Send Money)</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>নিচের যেকোনো একটি নাম্বারে পেমেন্ট সম্পন্ন করুন।</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.keys(numbers).length === 0 ? (
                       <p className="text-sm text-red-500 italic mb-2">দুঃখিত, বর্তমানে পেমেন্ট নাম্বার সেট করা নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।</p>
                    ) : Object.entries(numbers).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{val.label}</span>
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--navy)', letterSpacing: 0.5 }}>{val.number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: '0.5rem', color: 'var(--navy)' }}>ধাপ ২: তথ্য পূরণ করুন</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>টাকা পাঠানোর পর আপনি যে ট্রানজেকশন আইডি পেয়েছেন সেটি নিচের ফর্মে দিন।</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 10, padding: '1rem 1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16 }}>
              <ShieldCheck size={18} style={{ color: '#16a34a' }} />
              <p style={{ fontSize: 'var(--text-xs)', color: '#166534', fontWeight: 600 }}>আপনার তথ্য আমাদের কাছে সম্পূর্ণ নিরাপদ। সাধারণত ১-২ ঘণ্টার মধ্যে পেমেন্ট ভেরিফাই করা হয়।</p>
            </div>
          </div>

          {/* Form */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '2.5rem', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>নির্বাচিত প্ল্যান</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--lime-light)', padding: '1.25rem', borderRadius: 16 }}>
                  <div>
                    <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>{plan.name} সাবস্ক্রিপশন</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-600)', marginTop: 2 }}>{plan.periodText}</p>
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--navy)' }}>৳{plan.price}</span>
                </div>
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>পেমেন্ট মেথড</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    {['bkash', 'nagad', 'rocket'].map(m => (
                      <button key={m} type="button" onClick={() => setMethod(m)} 
                        style={{ 
                          padding: '0.75rem', borderRadius: 12, border: method === m ? '2px solid var(--navy)' : '1px solid var(--gray-200)', 
                          background: method === m ? '#f8fafc' : 'white', cursor: 'pointer', transition: 'all 0.2s',
                          fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'capitalize'
                        }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>বিকাশ/নগদ নাম্বার (যে নাম্বার থেকে পাঠিয়েছেন)</label>
                  <input type="text" className="form-input" placeholder="01XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>ট্রানজেকশন আইডি (Transaction ID)</label>
                  <input type="text" className="form-input" placeholder="TRX12345678" value={trxId} onChange={e => setTrxId(e.target.value)} required />
                </div>

                <button type="submit" disabled={loading} className="btn btn-navy btn-block btn-lg" style={{ marginTop: '1rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <><Send size={18} /> পেমেন্ট সাবমিট করুন</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </main>
  );
}
