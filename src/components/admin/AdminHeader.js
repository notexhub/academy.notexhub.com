'use client';
import { Bell, Search } from 'lucide-react';

export default function AdminHeader({ title = 'Admin Panel' }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
      style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 0 0 #f1f5f9' }}>
      <h1 className="text-xl font-bold" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
          <input
            placeholder="অনুসন্ধান করুন..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', width: 220 }}
          />
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <Bell size={16} style={{ color: '#64748b' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#CCFF00' }}></span>
        </button>
        <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid #e2e8f0' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ background: '#0f172a', color: '#CCFF00' }}>A</div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold" style={{ color: '#0f172a' }}>Admin</p>
            <p className="text-xs" style={{ color: '#94a3b8' }}>admin@notexhub.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
