'use client';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, VideoOff, Download, ChevronRight, ChevronLeft, BookOpen, FileText } from 'lucide-react';

export default function CourseViewer({ course, initialProgress = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set(initialProgress.map(String)));
  const [marking, setMarking] = useState(false);
  const [tab, setTab] = useState('content');

  const mod = course.modules?.[activeIdx];
  const pct = course.modules?.length ? Math.round((completed.size / course.modules.length) * 100) : 0;

  const getYtId = (url = '') => {
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    return m ? m[1] : null;
  };

  const markDone = async () => {
    if (!mod || marking || completed.has(String(mod._id))) return;
    setMarking(true);
    await fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: course._id, moduleId: mod._id })
    });
    setCompleted(prev => new Set([...prev, String(mod._id)]));
    setMarking(false);
  };

  const ytId = mod ? getYtId(mod.youtubeUrl) : null;
  // youtube-nocookie + params that reduce branding as much as YouTube allows
  const embedUrl = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&showinfo=0&fs=1&color=white&iv_load_policy=3&autohide=1&playsinline=1`
    : null;

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', background: '#0f172a', fontFamily: 'var(--font)' }}>

      {/* ── Top bar ── */}
      <div style={{ height: 56, background: '#0a0f1e', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1.5rem', flexShrink: 0, zIndex: 10 }}>
        <a href={`/courses/${course._id}`} style={{ color: '#CCFF00', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} /> ফিরে যান
        </a>

        {/* Platform brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <div style={{ width: 22, height: 22, background: '#CCFF00', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#0a1628' }}>N</div>
          <span style={{ color: '#CCFF00', fontWeight: 800, fontSize: 13 }}>NotexHub</span>
        </div>

        <span style={{ color: 'white', fontWeight: 700, fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div style={{ width: 140, height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#c6f135', transition: 'width 0.5s', borderRadius: 3 }} />
          </div>
          <span style={{ color: '#c6f135', fontSize: 11, fontWeight: 700 }}>{pct}%</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Video column ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Video wrapper — overlays hide YouTube chrome */}
          <div style={{ flex: 1, background: '#000', position: 'relative', overflow: 'hidden' }}>
            {embedUrl ? (
              <>
                {/*
                  iframe pushed up by 60px so YouTube's top title bar is clipped.
                  Height extended by 120px (60 top + 60 bottom) to compensate.
                */}
                <iframe
                  src={embedUrl}
                  style={{
                    position: 'absolute',
                    top: -60,
                    left: 0,
                    width: '100%',
                    height: 'calc(100% + 120px)',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={mod?.title}
                />

                {/* TOP overlay — solid black bar that covers the YouTube top chrome */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 64,
                  background: '#000',
                  pointerEvents: 'none', zIndex: 2,
                }} />

                {/* NotexHub brand watermark */}
                <div style={{
                  position: 'absolute', top: 10, left: 12, zIndex: 4,
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                  padding: '5px 12px 5px 8px', borderRadius: 20,
                  pointerEvents: 'none',
                }}>
                  <div style={{ width: 20, height: 20, background: '#CCFF00', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#0a1628' }}>N</div>
                  <span style={{ color: '#CCFF00', fontWeight: 800, fontSize: 12 }}>NotexHub</span>
                </div>

                {/* BOTTOM-RIGHT block — covers YouTube logo in controls */}
                <div style={{
                  position: 'absolute', bottom: 38, right: 0, zIndex: 3,
                  width: 100, height: 28,
                  background: 'rgba(0,0,0,0.85)',
                  pointerEvents: 'none',
                }} />
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <div style={{ textAlign: 'center' }}>
                  <VideoOff size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>ভিডিও পাওয়া যায়নি</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div style={{ padding: '1rem 1.5rem', background: '#0a0f1e', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{mod?.title}</p>
              <p style={{ color: '#475569', fontSize: 11 }}>মডিউল {activeIdx + 1} / {course.modules?.length}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {activeIdx > 0 && (
                <button onClick={() => setActiveIdx(i => i - 1)}
                  style={{ background: '#1e293b', color: '#94a3b8', border: 'none', padding: '0.6rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ChevronLeft size={16} /> আগের লেকচার
                </button>
              )}
              <button onClick={markDone} disabled={marking || completed.has(String(mod?._id))}
                style={{ background: completed.has(String(mod?._id)) ? '#166534' : '#CCFF00', color: completed.has(String(mod?._id)) ? '#bbf7d0' : '#0a1628', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                {completed.has(String(mod?._id)) ? <><CheckCircle2 size={16} /> সম্পন্ন</> : marking ? '...' : 'সম্পন্ন চিহ্নিত করুন'}
              </button>
              {activeIdx < (course.modules?.length || 1) - 1 && (
                <button onClick={() => setActiveIdx(i => i + 1)}
                  style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  পরের লেকচার <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 340, background: '#0a0f1e', borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #1e293b' }}>
            {['content', 'resources'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '1rem 0', background: 'transparent', border: 'none', color: tab === t ? '#c6f135' : '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', borderBottom: tab === t ? '2px solid #c6f135' : '2px solid transparent' }}>
                {t === 'content' ? <><BookOpen size={14} /> কন্টেন্ট</> : <><FileText size={14} /> রিসোর্স ({course.resources?.length || 0})</>}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tab === 'content' && (
              <>
                <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
                  <p style={{ color: '#94a3b8', fontSize: 11 }}>{completed.size}/{course.modules?.length} মডিউল সম্পন্ন</p>
                </div>
                {course.modules?.map((m, i) => {
                  const done = completed.has(String(m._id));
                  return (
                    <button key={i} onClick={() => setActiveIdx(i)} style={{
                      width: '100%', padding: '0.9rem 1.25rem', border: 'none',
                      background: i === activeIdx ? '#1a2744' : 'transparent',
                      textAlign: 'left', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      borderLeft: i === activeIdx ? '3px solid #c6f135' : '3px solid transparent',
                      transition: 'background 0.15s',
                    }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: done ? '#166534' : i === activeIdx ? '#CCFF00' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: done ? '#bbf7d0' : i === activeIdx ? '#0a1628' : '#475569', flexShrink: 0, marginTop: 1 }}>
                        {done ? <CheckCircle2 size={12} /> : i + 1}
                      </span>
                      <span style={{ color: i === activeIdx ? 'white' : done ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 600, lineHeight: 1.5 }}>{m.title}</span>
                    </button>
                  );
                })}
              </>
            )}

            {tab === 'resources' && (
              <div style={{ padding: '1rem' }}>
                {(!course.resources || course.resources.length === 0) ? (
                  <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>কোনো রিসোর্স নেই</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {course.resources?.map((r, i) => (
                      <div key={i} style={{ background: '#1e293b', borderRadius: 8, padding: '1rem' }}>
                        <p style={{ color: 'white', fontWeight: 600, fontSize: 13, wordBreak: 'break-word' }}>{r.title}</p>
                        <p style={{ color: '#94a3b8', fontSize: 11, wordBreak: 'break-all', marginTop: 4 }}>{r.fileName}</p>
                        <a href={r.fileData} download={r.fileName || 'resource'}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#CCFF00', color: '#0a1628', fontWeight: 800, fontSize: 11, textDecoration: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, marginTop: '0.5rem' }}>
                          <Download size={14} /> ডাউনলোড করুন
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
