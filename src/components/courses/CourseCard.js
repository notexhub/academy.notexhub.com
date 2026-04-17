import Link from 'next/link';

export default function CourseCard({ course }) {
  const id = typeof course._id === 'string' ? course._id : String(course._id);
  const cat = course.category || 'Development';
  const icons = { Design: '🎨', Marketing: '📱', Data: '🔬', Business: '📊' };
  const icon = icons[cat] || '💻';
  const bg = course.bannerBase64 ? `url(${course.bannerBase64}) center/cover no-repeat` : `linear-gradient(135deg, #0a1628, #1a3a5c)`;

  return (
    <Link href={`/courses/${id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Thumbnail */}
        <div style={{ height: 200, background: bg, position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem' }}>
            <span className={`badge ${course.isFree ? 'badge-free' : 'badge-premium'}`}>
              {course.isFree ? '🆓 বিনামূল্যে' : '⚡ প্রিমিয়াম'}
            </span>
          </div>
          {!course.bannerBase64 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>{icon}</div>
          )}
        </div>

        {/* Content */}
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ display: 'inline-block', color: '#5a7a00', fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{cat}</span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, lineHeight: 1.4, marginBottom: '0.6rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.title}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>{'★★★★★'}</div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--gray-700)' }}>5.0</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>(৫৪৮ রিভিউ)</span>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
              <span>📹 {course.modules?.length || 0} লেকচার</span>
              <span>👥 ২,৫০০+ শিক্ষার্থী</span>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: course.isFree ? '#5a7a00' : 'var(--navy)' }}>
              {course.isFree ? 'ফ্রি' : '৳১,৫০০'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
