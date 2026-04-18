'use client';
import { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Clock, Search, Filter, 
  CreditCard, User as UserIcon, Calendar, CheckSquare, 
  Trash2, MessageSquare, ExternalLink, Loader2, RefreshCw, Smartphone
} from 'lucide-react';

export default function SubscriptionManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/subscriptions');
      if (!res.ok) {
        if (res.status === 403) throw new Error('You do not have permission to view this page (Admin only).');
        if (res.status === 401) throw new Error('Your session has expired. Please log in again.');
        throw new Error('Failed to fetch subscription requests.');
      }
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    const comment = prompt(`Enter a comment for this ${status} (optional):`);
    setProcessingId(requestId);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, comment })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r._id === requestId ? { ...r, status, adminComment: comment } : r));
      } else {
        alert('Action failed. Please try again.');
      }
    } catch (error) {
      alert('Network error.');
    }
    setProcessingId(null);
  };

  const filtered = requests.filter(r => {
    const matchSearch = !search || 
      r.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fff7ed', color: '#c2410c', icon: Clock };
      case 'approved': return { bg: '#f0fdf4', color: '#15803d', icon: CheckCircle };
      case 'rejected': return { bg: '#fef2f2', color: '#b91c1c', icon: XCircle };
      default: return { bg: '#f1f5f9', color: '#475569', icon: Clock };
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>অর্থপ্রদান ব্যবস্থাপনা</p>
          <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>সাবস্ক্রিপশন রিকোয়েস্ট</h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>ম্যানুয়াল পেমেন্ট যাচাই ও অনুমোদন করুন</p>
        </div>
        <button 
          onClick={fetchRequests} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e2e8f0] text-xs font-bold text-[#64748b] hover:bg-[#fafafa] transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ করুন
        </button>
      </div>

      {/* Stats/Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search TrxID, Name or Email..." 
            style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${filter === f ? 'bg-[#0f172a] text-[#CCFF00]' : 'bg-white text-[#64748b] border border-[#e2e8f0]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#f1f5f9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>User & Plan</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Payment Info</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>TrxID & Method</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-sm font-medium text-[#94a3b8]">Loading requests...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="p-12 text-center text-sm font-medium text-red-500">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-sm font-medium text-[#94a3b8]">No records found.</td></tr>
              ) : filtered.map(r => {
                const style = getStatusStyle(r.status);
                const Icon = style.icon;
                return (
                  <tr key={r._id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f172a] text-[#CCFF00] flex items-center justify-center font-bold text-sm shrink-0">
                          {r.userId?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0f172a]">{r.userId?.name || 'Deleted User'}</p>
                          <p className="text-xs text-[#64748b]">{r.planName} Plan</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-[#0f172a]">৳{r.amount.toLocaleString()}</p>
                        <p className="text-xs text-[#94a3b8] flex items-center gap-1"><Smartphone size={10} /> {r.senderNumber}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-mono font-bold text-[#1e293b]">{r.transactionId}</p>
                        <span className="text-[10px] font-black uppercase inline-block border border-[#e2e8f0] px-1.5 py-0.5 rounded w-fit text-[#64748b]">{r.method}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full w-fit" style={{ background: style.bg, color: style.color }}>
                        <Icon size={12} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{r.status}</span>
                      </div>
                      {r.adminComment && <p className="text-[10px] mt-1 text-[#94a3b8] italic"><MessageSquare size={10} className="inline mr-1" />{r.adminComment}</p>}
                    </td>
                    <td className="p-4">
                      {r.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button 
                            disabled={processingId === r._id}
                            onClick={() => handleAction(r._id, 'approved')}
                            className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#16a34a] hover:bg-[#22c55e] hover:text-white transition-all flex items-center justify-center shadow-sm"
                          >
                            {processingId === r._id ? <Loader2 size={14} className="animate-spin" /> : <CheckSquare size={14} />}
                          </button>
                          <button 
                            disabled={processingId === r._id}
                            onClick={() => handleAction(r._id, 'rejected')}
                            className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all flex items-center justify-center shadow-sm"
                          >
                            {processingId === r._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] font-bold text-[#cbd5e1] uppercase">Processed</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
