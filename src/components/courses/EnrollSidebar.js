'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Loader2, CheckCircle, BookOpen, Infinity as InfinityIcon, Smartphone, Trophy, MessageCircle, GraduationCap, Share2, Send, Globe } from 'lucide-react';

export default function EnrollSidebar({ course, user: serverUser }) {
  const { user: reduxUser, isAuthenticated } = useSelector(state => state.auth);
  // Prioritize Redux state (client-side) over server-passed props
  const user = reduxUser || serverUser;
  
  const id = String(course._id);
  const isFree = course.isFree;
  const hasSub = user?.subscription?.plan && user.subscription.plan !== 'none' && new Date(user.subscription.expiresAt) > new Date();
  const isAdmin = user?.role === 'admin';

  const [enrolled, setEnrolled] = useState(false);
  const [checkingEnroll, setCheckingEnroll] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user) { setCheckingEnroll(false); return; }
    
    const headers = {};
    if (reduxUser?.token) headers['Authorization'] = `Bearer ${reduxUser.token}`;

    fetch(`/api/user/enroll?courseId=${id}`, {
      headers,
      credentials: 'include'
    })
      .then(r => r.json())
      .then(d => { setEnrolled(d.enrolled); setCheckingEnroll(false); })
      .catch(() => setCheckingEnroll(false));
  }, [id, user, reduxUser]);

  const handleEnroll = async () => {
    if (!user) { window.location.href = `/login?redirect=${encodeURIComponent(`/courses/${id}`)}`; return; }
    setEnrolling(true);
    setStatusMsg('এনরোলমেন্ট প্রসেস হচ্ছে...');

    // Nuclear token recovery
    let token = reduxUser?.token;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('notex_token');
    }
    
    // Legacy fallback (as a last resort)
    if (!token && typeof window !== 'undefined') {
      try {
        const persistData = JSON.parse(localStorage.getItem('persist:notex_root'));
        if (persistData && persistData.auth) {
          const authData = JSON.parse(persistData.auth);
          token = authData.token;
        }
      } catch (err) {
        console.warn('[Enroll] Legacy recovery failed:', err);
      }
    }

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log('[Enroll] Running enrollment...', { 
      hasToken: !!token, 
      tokenSource: reduxUser?.token ? 'redux' : (token ? 'localStorage' : 'none'),
      hasUser: !!user 
    });

    try {
      const res = await fetch('/api/user/enroll', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ courseId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('অভিনন্দন! এনরোলমেন্ট সফল হয়েছে।');
        setEnrolled(true);
        setTimeout(() => {
          router.push(`/learn/${id}`);
        }, 1500);
      } else {
        const errorDetail = data.reason ? ` (${data.reason})` : '';
        setStatusMsg(`${data.error || 'এনরোল করতে সমস্যা হয়েছে'}${errorDetail}`);
        console.error('[Enroll] Failed:', data);
      }
    } catch (err) {
      setStatusMsg('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
      console.error('[Enroll] Network Error:', err);
    }
    setEnrolling(false);
  };

  const features = [
    { icon: BookOpen, text: `${course.modules?.length || 0} টি ভিডিও লেকচার` },
    { icon: InfinityIcon, text: 'লাইফটাইম এক্সেস' },
    { icon: Smartphone, text: 'মোবাইল ও ডেস্কটপে দেখুন' },
    { icon: Trophy, text: 'কোর্স কমপ্লিশন সার্টিফিকেট' },
    { icon: MessageCircle, text: 'ইন্সট্রাক্টর সাপোর্ট' },
  ];

  const renderCTA = () => {
    if (checkingEnroll) {
      return (
        <div className="btn btn-lime btn-block btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '0.75rem', opacity: 0.7 }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> লোড হচ্ছে...
        </div>
      );
    }

    // Already enrolled → go to learn
    if (enrolled || isAdmin) {
      return (
        <Link href={`/learn/${id}`} className="btn btn-lime btn-block btn-lg" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <CheckCircle size={18} /> কোর্স চালিয়ে যান →
        </Link>
      );
    }

    // Free course → enroll button
    if (isFree) {
      if (!user) {
        return (
          <Link href={`/login?redirect=${encodeURIComponent(`/courses/${id}`)}`} className="btn btn-navy btn-block btn-lg" style={{ marginBottom: '0.75rem' }}>
            লগ ইন করে এনরোল করুন
          </Link>
        );
      }
      return (
        <button onClick={handleEnroll} disabled={enrolling}
          className="btn btn-lime btn-block btn-lg"
          style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', border: 'none', width: '100%', fontSize: '1rem', fontWeight: 700, padding: '0.9rem' }}>
          {enrolling ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> এনরোল হচ্ছে...</> : <><GraduationCap size={18} /> বিনামূল্যে এনরোল করুন</>}
        </button>
      );
    }

    // Paid course — need subscription
    if (hasSub) {
      return (
        <button onClick={handleEnroll} disabled={enrolling}
          className="btn btn-lime btn-block btn-lg"
          style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', border: 'none', width: '100%', fontSize: '1rem', fontWeight: 700, padding: '0.9rem' }}>
          {enrolling ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> এনরোল হচ্ছে...</> : <><BookOpen size={18} /> কোর্সে এনরোল করুন</>}
        </button>
      );
    }

    // No subscription
    if (!user) {
      return (
        <Link href={`/login?redirect=${encodeURIComponent(`/courses/${id}`)}`} className="btn btn-navy btn-block btn-lg" style={{ marginBottom: '0.75rem' }}>
          লগ ইন করে শুরু করুন
        </Link>
      );
    }
    return (
      <Link href="/pricing" className="btn btn-navy btn-block btn-lg" style={{ marginBottom: '0.75rem' }}>
        সাবস্ক্রিপশন কিনুন
      </Link>
    );
  };

  return (
    <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', position: 'sticky', top: 'calc(var(--header-h) + 1.5rem)' }}>
      {/* Preview Image */}
      <div style={{ height: 200, background: course.bannerBase64 ? `url(${course.bannerBase64}) center/cover` : 'linear-gradient(135deg, #0a1628, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#CCFF00' }}>
        {!course.bannerBase64 && <GraduationCap size={64} style={{ opacity: 0.4 }} />}
      </div>

      <div style={{ padding: '1.75rem' }}>
        {/* Price */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: isFree ? '#5a7a00' : 'var(--navy)' }}>
            {isFree ? 'বিনামূল্যে' : `৳ ${Number(course.price || 1500).toLocaleString()}`}
          </span>
          {!isFree && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>৳ ৩,০০০</span>}
        </div>

        {/* Enrollment badge */}
        {enrolled && !checkingEnroll && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#15803d', borderRadius: 10, padding: '8px 14px', marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
            <CheckCircle size={15} /> আপনি এই কোর্সে এনরোল করেছেন
          </div>
        )}

        {/* Status Message */}
        {statusMsg && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: statusMsg.includes('সফল') ? '#dcfce7' : '#fef2f2', color: statusMsg.includes('সফল') ? '#15803d' : '#ef4444', marginBottom: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s ease' }}>
            {statusMsg.includes('প্রসেস') ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
            {statusMsg}
          </div>
        )}

        {/* CTA */}
        {renderCTA()}

        <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 'var(--text-xs)', marginBottom: '1.5rem' }}>৩০ দিনের মানি–ব্যাক গ্যারান্টি</p>

        {/* Features */}
        <div className="divider" />
        <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: 'var(--text-sm)' }}>এই কোর্সে যা পাবেন:</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {features.map(f => (
            <li key={f.text} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <f.icon size={14} style={{ color: '#5a7a00', flexShrink: 0 }} /> {f.text}
            </li>
          ))}
        </ul>

        <div className="divider" />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>শেয়ার করুন:</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {[
              { icon: Share2, color: '#1877f2' },
              { icon: Send, color: '#1da1f2' },
              { icon: Globe, color: '#0a66c2' }
            ].map((s, idx) => (
              <button key={idx} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: 'var(--gray-400)' }}
                onMouseEnter={e => { e.currentTarget.style.color = s.color; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--gray-400)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'white'; }}
              >
                <s.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
