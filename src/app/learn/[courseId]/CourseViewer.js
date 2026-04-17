'use client';
import { useState, useEffect } from 'react';

export default function CourseViewer({ course, initialProgress = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set(initialProgress.map(String)));
  const [marking, setMarking] = useState(false);

  const mod = course.modules?.[activeIdx];
  const pct = course.modules?.length ? Math.round((completed.size / course.modules.length) * 100) : 0;
  const getYtId = (url = '') => {
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    return m ? m[1] : null;
  };

  const markDone = async () => {
    if (!mod || marking || completed.has(String(mod._id))) return;
    setMarking(true);
    await fetch('/api/user/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: course._id, moduleId: mod._id }) });
    setCompleted(prev => new Set([...prev, String(mod._id)]));
    setMarking(false);
  };

  const ytId = mod ? getYtId(mod.youtubeUrl) : null;
  const embedUrl = ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&showinfo=0&fs=1&color=white&iv_load_policy=3&autohide=1` : null;

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', background: '#0f172a', fontFamily: 'var(--font)' }}>
      {/* Top Bar */}
      <div style={{ height: 56, background: '#0a0f1e', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1.5rem', flexShrink: 0, zIndex: 10 }}>
        <a href={`/courses/${course._id}`} style={{ color: '#c6f135', fontWeight: 700, fontSize: 'var(--text-sm)', textDecoration: 'none' }}>← Back</a>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 140, height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--lime)', transition: 'width 0.5s', borderRadius: 3 }} />
          </div>
          <span style={{ color: '#c6f135', fontSize: 'var(--text-xs)', fontWeight: 700, minWidth: 40 }}>{pct}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Video Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, background: '#000', position: 'relative' }}>
            {embedUrl ? (
              <iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={mod?.title} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <div style={{ textAlign: 'center' }}><p style={{ fontSize: '3rem' }}>📹</p><p>ভিডিও পাওয়া যায়নি</p></div>
              </div>
            )}
          </div>
          {/* Controls */}
          <div style={{ padding: '1rem 1.5rem', background: '#0a0f1e', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{mod?.title}</p>
              <p style={{ color: '#475569', fontSize: 'var(--text-xs)' }}>Module {activeIdx + 1} of {course.modules?.length}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {activeIdx > 0 && <button onClick={() => setActiveIdx(i => i - 1)} style={{ background: '#1e293b', color: '#94a3b8', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}>← আগের লেকচার</button>}
              <button onClick={markDone} disabled={marking || completed.has(String(mod?._id))} style={{ background: completed.has(String(mod?._id)) ? '#166534' : 'var(--lime)', color: completed.has(String(mod?._id)) ? '#bbf7d0' : 'var(--navy)', border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 'var(--text-xs)', transition: 'var(--transition)' }}>
                {completed.has(String(mod?._id)) ? '✓ সম্পন্ন' : marking ? '...' : 'সম্পন্ন চিহ্নিত করুন'}
              </button>
              {activeIdx < (course.modules?.length || 1) - 1 && <button onClick={() => setActiveIdx(i => i + 1)} style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}>পরের লেকচার →</button>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 340, background: '#0a0f1e', borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
            <p style={{ color: '#c6f135', fontWeight: 700, fontSize: 'var(--text-sm)' }}>কোর্স কন্টেন্ট</p>
            <p style={{ color: '#475569', fontSize: 'var(--text-xs)', marginTop: 2 }}>{completed.size}/{course.modules?.length} সম্পন্ন</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {course.modules?.map((m, i) => {
              const done = completed.has(String(m._id));
              return (
                <button key={i} onClick={() => setActiveIdx(i)} style={{
                  width: '100%', padding: '1rem 1.25rem', border: 'none', background: i === activeIdx ? '#1a2744' : 'transparent',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  borderLeft: i === activeIdx ? '3px solid var(--lime)' : '3px solid transparent', transition: 'var(--transition)',
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: done ? '#166534' : i === activeIdx ? 'var(--lime)' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: done ? '#bbf7d0' : i === activeIdx ? 'var(--navy)' : '#475569', flexShrink: 0, marginTop: 1 }}>{done ? '✓' : i + 1}</span>
                  <span style={{ color: i === activeIdx ? 'white' : done ? '#64748b' : '#94a3b8', fontSize: 'var(--text-xs)', fontWeight: 600, lineHeight: 1.5 }}>{m.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
