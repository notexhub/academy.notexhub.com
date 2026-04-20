'use client';
import { useState } from 'react';
import { Star, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ReviewForm({ courseId, isEnrolled }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isEnrolled) {
    return (
      <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 20, border: '2px dashed #e2e8f0', textAlign: 'center' }}>
        <MessageSquare size={32} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>রিভিউ দিতে এনরোল করুন</h3>
        <p style={{ fontSize: 13, color: '#64748b' }}>কোর্সটি কেনার পর আপনি আপনার মূল্যবান মতামত শেয়ার করতে পারবেন।</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ padding: '2rem', background: '#ecfdf5', borderRadius: 20, border: '2px solid #bbf7d0', textAlign: 'center' }}>
        <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#064e3b', marginBottom: 8 }}>রিভিউ জমা হয়েছে!</h3>
        <p style={{ fontSize: 13, color: '#065f46' }}>আপনার রিভিউটি পেন্ডিং অবস্থায় আছে। অ্যাডমিন অ্যাপ্রুভ করলে এটি প্রদর্শিত হবে।</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) return setError('রিভিউ লিখুন!');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, rating, quote })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: 20, border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        একজন শিক্ষার্থী হিসেবে আপনার মতামত দিন
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>রেটিং দিন *</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'transform 0.1s' }}
                className="hover:scale-110"
              >
                <Star
                  size={28}
                  style={{
                    color: star <= (hover || rating) ? '#f59e0b' : '#e2e8f0',
                    fill: star <= (hover || rating) ? '#f59e0b' : 'none'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>আপনার অভিজ্ঞতা লিখুন *</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="কোর্সটি আপনার কেমন লেগেছে? ইন্সট্রাক্টর বা কন্টেন্ট সম্পর্কে কি বলবেন?"
            style={{ width: '100%', padding: '1rem', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', minHeight: 120, boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: '1rem', fontWeight: 600 }}>❌ {error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '1rem', borderRadius: 12, background: '#0f172a', color: '#CCFF00', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> সাবমিট হচ্ছে...</> : 'রিভিউ সাবমিট করুন'}
        </button>
      </form>
    </div>
  );
}
