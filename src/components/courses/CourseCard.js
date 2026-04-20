'use client';
import Link from 'next/link';
import { PlayCircle, Users, Star, BookOpen, Download, Award } from 'lucide-react';

export default function CourseCard({ course }) {
  const id = typeof course._id === 'string' ? course._id : String(course._id);
  const bg = course.bannerBase64
    ? `url(${course.bannerBase64}) center/cover no-repeat`
    : `linear-gradient(135deg, #0a1628, #1a3a5c)`;

  return (
    <Link href={`/courses/${id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}
      >
        {/* Thumbnail */}
        <div style={{ height: 200, background: bg, position: 'relative', flexShrink: 0, borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />

          {/* Badge */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: course.isFree ? 'rgba(21,128,61,0.9)' : 'rgba(10,22,40,0.85)',
              backdropFilter: 'blur(6px)',
              color: course.isFree ? '#bbf7d0' : '#CCFF00',
              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
              border: `1px solid ${course.isFree ? 'rgba(134,239,172,0.3)' : 'rgba(204,255,0,0.3)'}`,
            }}>
              {course.isFree ? <><Award size={11} /> বিনামূল্যে</> : <><Download size={11} /> প্রিমিয়াম</>}
            </span>
          </div>

          {/* Play button overlay */}
          {!course.bannerBase64 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayCircle size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ display: 'inline-block', color: '#5a7a00', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {course.category || 'General'}
          </span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, lineHeight: 1.4, marginBottom: '0.6rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.title}
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>

          {/* Rating row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-700)' }}>5.0</span>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>(৫৪৮ রিভিউ)</span>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', fontSize: 11, color: 'var(--gray-500)', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <BookOpen size={12} /> {course.modules?.length || 0} লেকচার
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} /> ২,৫০০+
              </span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: course.isFree ? '#15803d' : 'var(--navy)' }}>
              {course.isFree ? 'ফ্রি' : '৳১,৫০০'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
