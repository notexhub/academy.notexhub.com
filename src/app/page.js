import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Review from '@/models/Review';
import Partner from '@/models/Partner';
import Category from '@/models/Category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import { HomeCategoriesSection, HomePartnersSection } from '@/components/home/HomeSections';
import CourseCard from '@/components/courses/CourseCard';
import Link from 'next/link';
import {
  BookOpen, Download, Award, Infinity as InfinityIcon, Video, Monitor, RefreshCw, Users,
  GraduationCap, Star, TrendingUp, Globe, ArrowRight, ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const FALLBACK_CATS = [
  { name: 'ওয়েব ডেভেলপমেন্ট' }, { name: 'গ্রাফিক ডিজাইন' },
  { name: 'ডিজিটাল মার্কেটিং' }, { name: 'ডেটা সায়েন্স' },
  { name: 'বিজনেস' }, { name: 'প্রোগ্রামিং' },
];

const trustItems = [
  { icon: BookOpen, text: '২০০+ কোর্স এক্সেস' },
  { icon: Download, text: 'কন্টেন্ট ডাউনলোড সুবিধা' },
  { icon: Award, text: '৫০০+ সার্টিফিকেট ইস্যু' },
  { icon: InfinityIcon, text: 'আনলিমিটেড এক্সেস' },
  { icon: Globe, text: 'বাংলায় সম্পূর্ণ কোর্স' },
];

const whyItems = [
  { icon: InfinityIcon, title: 'আনলিমিটেড কোর্স', desc: 'একটি সাবস্ক্রিপশনেই ২০০+ কোর্সে সম্পূর্ণ এক্সেস পান।' },
  { icon: Download, title: 'কন্টেন্ট ডাউনলোড', desc: 'পছন্দের ভিডিও ও PDF কন্টেন্ট ডাউনলোড করে অফলাইনে দেখুন।' },
  { icon: Award, title: 'অফিশিয়াল সার্টিফিকেট', desc: 'কোর্স শেষ করে ভেরিফাইড সার্টিফিকেট ডাউনলোড করুন।' },
  { icon: Video, title: 'HD ভিডিও কোয়ালিটি', desc: 'হাই-কোয়ালিটি ভিডিও লেকচার যেকোনো ডিভাইসে দেখুন।' },
  { icon: RefreshCw, title: 'নিয়মিত নতুন কোর্স', desc: 'প্রতি মাসে নতুন কোর্স যোগ হয়, সাবস্ক্রাইবরা স্বয়ংক্রিয়ভাবে পান।' },
  { icon: Monitor, title: 'যেকোনো ডিভাইসে', desc: 'মোবাইল, ট্যাবলেট বা কম্পিউটার — সব জায়গায় চলে।' },
  { icon: Users, title: 'কমিউনিটি সাপোর্ট', desc: 'হাজারো শিক্ষার্থীর একটিভ কমিউনিটিতে যোগ দিন।' },
  { icon: ShieldCheck, title: 'সাশ্রয়ী মূল্য', desc: 'আলাদা আলাদা কোর্স কেনার চেয়ে সাবস্ক্রিপশন অনেক সাশ্রয়ী।' },
];

export default async function Home() {
  let courses = [];
  let reviews = [];
  let partners = [];
  let categories = FALLBACK_CATS;
  const fallbackPartners = ['Pathao', 'bKash', 'Grameenphone', 'Robi', 'Daraz', 'Shajgoj', 'Chaldal', 'Shohoz'];
  let partnerNames = fallbackPartners;

  try {
    await dbConnect();
    const [rawCourses, rawReviews, rawPartners, rawCats] = await Promise.all([
      Course.find({ isActive: true }).limit(6).lean(),
      Review.find({}).limit(4).lean(),
      Partner.find({}).limit(8).lean(),
      Category.find({ isActive: true }).limit(6).lean(),
    ]);

    courses = JSON.parse(JSON.stringify(rawCourses || []));
    reviews = JSON.parse(JSON.stringify(rawReviews || []));
    partners = JSON.parse(JSON.stringify(rawPartners || []));
    categories = (rawCats && rawCats.length > 0) ? JSON.parse(JSON.stringify(rawCats)) : FALLBACK_CATS;
    
    if (partners.length > 0) {
      partnerNames = partners.map(p => p.companyName);
    }
  } catch (error) {
    console.error("Database connection error in Home page:", error);
  }

  return (
    <main style={{ background: '#ffffff' }}>
      <Navbar />
      <Hero />

      {/* ── Trust bar ── */}
      <div style={{ background: '#0f172a', padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          {trustItems.map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
              <Icon size={16} style={{ color: '#CCFF00', flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <HomeCategoriesSection categories={categories} />

      {/* ── Featured Courses ── */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'inline-block', background: '#f8fafc', color: '#64748b', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 50, border: '1px solid #e2e8f0', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>কোর্সসমূহ</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>জনপ্রিয় কোর্সসমূহ</h2>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>আমাদের সবচেয়ে জনপ্রিয় কোর্সগুলো এক জায়গায়।</p>
            </div>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0f172a', color: '#CCFF00', padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              সব কোর্স দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <BookOpen size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontWeight: 700 }}>শীঘ্রই কোর্স আসছে!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why NotexHub ── */}
      <section style={{ padding: '6rem 0', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,255,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(204,255,0,0.1)', color: '#CCFF00', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 50, border: '1px solid rgba(204,255,0,0.2)', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>কেন নোটেক্সহাব?</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>একটি সাবস্ক্রিপশনে সব কিছু</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>শুধু কোর্স নয় — দেখুন, ডাউনলোড করুন এবং সার্টিফিকেট নিন।</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {whyItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.75rem' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(204,255,0,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} style={{ color: '#CCFF00' }} />
                </div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: 15, marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <HomePartnersSection partnerNames={partnerNames} />

      {/* ── Testimonials ── */}
      {reviews.length > 0 && (
        <section style={{ padding: '6rem 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ display: 'inline-block', background: '#fef9c3', color: '#a16207', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 50, border: '1px solid #fde68a', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>সাফল্যের গল্প</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>শিক্ষার্থীরা কী বলছেন</h2>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>তাদের কথায় জানুন কীভাবে NotexHub জীবন বদলে দিয়েছে।</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {reviews.map((r, i) => (
                <div key={r._id} style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                  </div>
                  <p style={{ color: '#374151', lineHeight: 1.8, flex: 1, fontSize: 14, fontStyle: 'italic' }}>&ldquo;{r.quote}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `hsl(${i * 80 + 200}, 60%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                      {r.studentName?.[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{r.studentName}</p>
                      <p style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>{r.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '7rem 0', background: 'linear-gradient(135deg, #060d1b 0%, #0a1628 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,255,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <span style={{ display: 'inline-block', background: 'rgba(204,255,0,0.1)', color: '#CCFF00', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 50, border: '1px solid rgba(204,255,0,0.2)', marginBottom: 24, letterSpacing: '0.06em', textTransform: 'uppercase' }}>শুরু করুন আজই</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '1rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            একটি সাবস্ক্রিপশনে<br />
            <span style={{ background: 'linear-gradient(90deg, #CCFF00, #a3e635)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>২০০+ কোর্সে আনলিমিটেড এক্সেস</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: 540, margin: '0 auto 3rem' }}>
            দেখুন, ডাউনলোড করুন এবং কোর্স শেষ করে অফিশিয়াল সার্টিফিকেট নিন — সবই একটি প্ল্যানে।
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#CCFF00', color: '#0a1628', padding: '16px 36px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(204,255,0,0.2)' }}>
              <TrendingUp size={18} /> সাবস্ক্রিপশন প্ল্যান দেখুন
            </Link>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: 'white', padding: '16px 28px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              <BookOpen size={16} /> কোর্স তালিকা দেখুন
            </Link>
          </div>
          <p style={{ color: '#475569', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <ShieldCheck size={14} style={{ color: '#64748b' }} /> যেকোনো সময় বাতিল করুন &nbsp;·&nbsp; ৩০ দিনের মানি-ব্যাক গ্যারান্টি
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
