'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Star, Building2,
  Users, Award, ArrowLeft, ChevronRight, Folder, Settings, GraduationCap,
  CreditCard, Landmark, Tags
} from 'lucide-react';

const navItems = [
  { label: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
  { label: 'ক্যাটাগরি', href: '/admin/categories', icon: Folder },
  { label: 'কোর্স ম্যানেজমেন্ট', href: '/admin/courses', icon: BookOpen },
  { label: 'প্রাইসিং ম্যানেজমেন্ট', href: '/admin/pricing', icon: Tags },
  { label: 'ইউজার ম্যানেজমেন্ট', href: '/admin/users', icon: Users },
  { label: 'এনরোলমেন্ট হিস্ট্রি', href: '/admin/enrollments', icon: GraduationCap },
  { label: 'সাবস্ক্রিপশন', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'সার্টিফিকেট', href: '/admin/certificates', icon: Award },
  { label: 'রিভিউ', href: '/admin/reviews', icon: Star },
  { label: 'পার্টনার', href: '/admin/partners', icon: Building2 },
  { label: 'পেমেন্ট সেটিংস', href: '/admin/payment-settings', icon: Landmark },
  { label: 'ওয়েবসাইট সেটিংস', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 flex flex-col z-50" style={{ background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg shrink-0" style={{ background: '#CCFF00', color: '#0f172a' }}>N</div>
        <div>
          <p className="font-bold text-white text-sm leading-none">নোটেক্সহাব</p>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Admin Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#334155' }}>মেনু</p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = path === href || (href !== '/admin' && path.startsWith(href));
          return (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-all duration-150 no-underline"
              style={{ background: active ? 'rgba(204,255,0,0.1)' : 'transparent', borderLeft: active ? '3px solid #CCFF00' : '3px solid transparent' }}>
              <Icon size={16} style={{ color: active ? '#CCFF00' : '#475569' }} />
              <span className="text-sm font-medium" style={{ color: active ? '#CCFF00' : '#94a3b8' }}>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" style={{ color: '#CCFF00' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 no-underline group"
          style={{ color: '#64748b' }}>
          <ArrowLeft size={15} />
          <span className="text-xs font-medium">ওয়েবসাইটে ফিরে যান</span>
        </Link>
      </div>
    </aside>
  );
}
