import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
  Search, Filter, Download, Clock, CheckCircle2, XCircle, Copy, Check,
  Plus, ChevronLeft, ChevronRight, TrendingUp, UserCheck, RefreshCw,
  Sparkles, Calendar, Layers, Activity, ArrowRightLeft, Languages,
  BarChart3, Wallet, AlertCircle, ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/* ─── constants ─────────────────────────── */
const PIE_COLORS = ['#e8184a', '#f59e0b', '#10b981', '#6366f1', '#ec4899'];

const LANG_COLORS = {
  Hindi:   { bg: 'bg-orange-500/10',  text: 'text-orange-500 dark:text-orange-400',  border: 'border-orange-500/20' },
  Tamil:   { bg: 'bg-indigo-500/10',  text: 'text-indigo-500 dark:text-indigo-400',  border: 'border-indigo-500/20' },
  Telugu:  { bg: 'bg-pink-500/10',    text: 'text-pink-500 dark:text-pink-400',       border: 'border-pink-500/20' },
  Marathi: { bg: 'bg-blue-500/10',    text: 'text-blue-500 dark:text-blue-400',       border: 'border-blue-500/20' },
  English: { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-500/20' },
};

/* ─── Animated number ───────────────────── */
function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const spring = useSpring(0, { bounce: 0, duration: 1400 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { spring.set(value); }, [value, spring]);
  useEffect(() => spring.onChange(v => setDisplay(Math.floor(v))), [spring]);
  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

/* ─── Skeleton row ──────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      <td colSpan={7} className="p-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100/50 dark:border-dark-800/40 last:border-0">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-3 w-32 ml-6" />
            <div className="skeleton h-3 w-24 ml-6" />
            <div className="skeleton h-3 w-16 ml-6" />
            <div className="skeleton h-5 w-16 rounded-full ml-6" />
            <div className="skeleton h-5 w-20 rounded-full ml-auto" />
          </div>
        ))}
      </td>
    </tr>
  );
}

/* ─── Custom Tooltip ────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 rounded-xl text-xs shadow-glass-dark border border-white/10">
      <p className="text-slate-400 dark:text-dark-400 mb-1 font-medium">{label}</p>
      <p className="font-bold text-slate-900 dark:text-white text-sm">
        ₹{payload[0].value?.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

/* ─── Motion variants ───────────────────── */
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const rise    = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

/* ─────────────────────────────────────────── */
export default function Dashboard() {
  const { applications, summary, pagination, loading, fetchApplications, fetchSummary, updateStatus } = useStore();
  const navigate = useNavigate();

  const [search,    setSearch]    = useState('');
  const [debSearch, setDebSearch] = useState('');
  const [filter,    setFilter]    = useState('all');
  const [page,      setPage]      = useState(1);
  const [copiedId,  setCopiedId]  = useState(null);
  const [modalApp,  setModalApp]  = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => { setDebSearch(search); setPage(1); }, 420);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { fetchApplications({ status: filter, search: debSearch, page, limit: 8 }); },
    [filter, debSearch, page]);

  useEffect(() => { fetchSummary(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSummary(), fetchApplications({ status: filter, search: debSearch, page, limit: 8 })]);
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Application ID copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusUpdate = async (id, status) => {
    await updateStatus(id, status);
    setModalApp(prev => prev ? { ...prev, status } : null);
  };

  const exportCSV = () => {
    if (!applications.length) { toast.error('No data to export.'); return; }
    const h = ['ID','Name','Mobile','Amount','Purpose','Language','Status','Date'];
    const rows = applications.map(a => [
      a.id, a.applicant_name, a.mobile_number, a.loan_amount,
      `"${a.loan_purpose?.replace(/"/g,'""')}"`,
      a.preferred_language, a.status,
      new Date(a.created_at).toLocaleString('en-IN'),
    ]);
    const blob = new Blob([[h, ...rows].map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vitto_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported!');
  };

  const chartData = (summary.recentApplications || []).slice().reverse().map(a => ({
    date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(a.loan_amount),
  }));

  const langColor = (l) => LANG_COLORS[l] || LANG_COLORS.English;

  return (
    <div className="space-y-7 pb-12">

      {/* ── Header ────────────────────────────────────── */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-500 dark:text-brand-400">
              <Sparkles size={13} className="animate-pulse-glow" />
            </span>
            <span className="text-[11px] font-display font-bold tracking-[0.15em] text-brand-500 dark:text-brand-400 uppercase text-glow">
              Operations Center
            </span>
          </div>
          <h2 className="text-gradient-hero font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none">
            Overview Analytics
          </h2>
          <p className="text-slate-500 dark:text-dark-400 text-sm mt-2 font-sans max-w-md">
            Monitor incoming loan submissions, approve requests, and track portfolio health in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={handleRefresh}
            className="btn-ghost p-2.5 !px-2.5" title="Refresh">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={exportCSV}
            className="btn-ghost gap-2">
            <Download size={14} /> <span className="hidden sm:inline">Export CSV</span>
          </motion.button>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={() => navigate('/apply')}
            className="btn-primary flex items-center gap-2">
            <Plus size={15} /> New Application
          </motion.button>
        </div>
      </motion.div>

      {/* ── Stats cards ───────────────────────────────── */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            label: 'Total Applications', icon: Layers, color: 'brand',
            value: summary.totalApplications || 0,
            sub: 'Active underwriting pipeline',
            accent: 'from-brand-500/8 to-transparent',
            iconColor: 'text-brand-500 dark:text-brand-400',
            iconBg: 'bg-brand-500/10 dark:bg-brand-500/15',
          },
          {
            label: 'Capital Requested', icon: Wallet, color: 'indigo',
            value: summary.totalAmount || 0, prefix: '₹',
            sub: `Avg ₹${summary.totalApplications > 0 ? Math.round((summary.totalAmount||0)/summary.totalApplications).toLocaleString('en-IN') : 0}`,
            accent: 'from-indigo-500/8 to-transparent',
            iconColor: 'text-indigo-500 dark:text-indigo-400',
            iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
          },
          {
            label: 'Approved Volume', icon: UserCheck, color: 'emerald',
            value: summary.approvedAmount || 0, prefix: '₹',
            sub: `${summary.statusCounts?.approved || 0} applications approved`,
            accent: 'from-emerald-500/8 to-transparent',
            iconColor: 'text-emerald-500 dark:text-emerald-400',
            iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          },
          {
            label: 'Pending Reviews', icon: Clock, color: 'amber',
            value: summary.statusCounts?.pending || 0,
            sub: `${summary.statusCounts?.rejected || 0} rejected`,
            accent: 'from-amber-500/8 to-transparent',
            iconColor: 'text-amber-500 dark:text-amber-400',
            iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
          },
        ].map(({ label, icon: Icon, value, prefix='', sub, accent, iconColor, iconBg }) => (
          <motion.div key={label} variants={rise}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-panel rounded-2xl p-5 relative overflow-hidden group cursor-default">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-400 dark:text-dark-500 leading-none">
                  {label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon size={15} className={iconColor} />
                </div>
              </div>
              <div className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight leading-none">
                <AnimatedCounter value={value} prefix={prefix} />
              </div>
              <div className="mt-3 text-[11px] font-medium text-slate-400 dark:text-dark-500 flex items-center gap-1">
                <ArrowUpRight size={11} className={iconColor} />
                {sub}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts ────────────────────────────────────── */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Area chart */}
        <motion.div variants={rise}
          className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/40 dark:border-white/[0.05] h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-dark-100 flex items-center gap-2 text-sm">
                <TrendingUp size={15} className="text-brand-500" /> Capital Demand Curve
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-dark-500 mt-0.5">Loan amounts from recent applications</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-300 dark:text-dark-600 uppercase tracking-wider">Last 10</span>
          </div>
          <div className="flex-1 min-h-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#e8184a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#e8184a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize:10, fill:'#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize:10, fill:'#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke:'rgba(232,24,74,0.2)', strokeWidth:1.5, strokeDasharray:'5 3' }} />
                  <Area type="monotone" dataKey="amount" stroke="#e8184a" strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    activeDot={{ r:5, fill:'#e8184a', stroke:'#fff', strokeWidth:2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-dark-600">
                <BarChart3 size={28} className="opacity-40" />
                <p className="text-xs font-medium">Submit applications to generate chart data</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pie chart */}
        <motion.div variants={rise}
          className="glass-panel rounded-2xl p-5 border border-white/40 dark:border-white/[0.05] h-[300px] flex flex-col">
          <div className="shrink-0 mb-3">
            <h3 className="font-display font-bold text-slate-800 dark:text-dark-100 flex items-center gap-2 text-sm">
              <Languages size={15} className="text-brand-500" /> Language Split
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-dark-500 mt-0.5">Borrower communication preferences</p>
          </div>
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
            {(summary.languageDistribution?.length > 0) ? (
              <>
                <div className="w-full h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={summary.languageDistribution}
                        cx="50%" cy="50%" innerRadius={44} outerRadius={62}
                        paddingAngle={5} dataKey="value" stroke="none"
                        animationBegin={200} animationDuration={800}>
                        {summary.languageDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{
                        background:'rgba(15,22,35,0.95)', backdropFilter:'blur(12px)',
                        border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px',
                        color:'#fff', fontSize:'12px',
                      }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full mt-2">
                  {summary.languageDistribution.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[11px] font-medium text-slate-600 dark:text-dark-300 truncate">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-dark-600">
                <Languages size={26} className="opacity-40" />
                <p className="text-xs font-medium">No data yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Applications table ────────────────────────── */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3
          p-3 glass-panel rounded-2xl border border-white/40 dark:border-white/[0.05]">

          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-500 pointer-events-none" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name or mobile…"
              className="input-base pl-9 pr-4 py-2.5 text-[13px]" />
          </div>

          <div className="flex items-center gap-2.5">
            <Filter size={13} className="text-slate-400 dark:text-dark-500 shrink-0" />
            <div className="relative">
              <select
                value={filter}
                onChange={e => { setFilter(e.target.value); setPage(1); }}
                className="input-base pl-3 pr-8 py-2.5 text-[13px] appearance-none min-w-[160px]">
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-2xl border border-white/40 dark:border-white/[0.05] overflow-hidden shadow-glass">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100/60 dark:divide-dark-800/40 text-sm">
              <thead className="bg-slate-50/70 dark:bg-dark-900/60 backdrop-blur-sm">
                <tr>
                  {['ID / Date','Applicant','Mobile','Amount (₹)','Language','Status','Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-display font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-dark-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-dark-800/30 bg-white/10 dark:bg-transparent">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <SkeletonRow key="skel" />
                  ) : applications.length === 0 ? (
                    <motion.tr key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                      <td colSpan={7}>
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 dark:text-dark-600">
                          <AlertCircle size={32} strokeWidth={1.2} />
                          <p className="font-semibold text-sm text-slate-500 dark:text-dark-500">No applications found</p>
                          <p className="text-xs">Adjust your search or filter, or submit a new application.</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    applications.map((app, i) => {
                      const lc = langColor(app.preferred_language);
                      return (
                        <motion.tr
                          key={app.id}
                          initial={{ opacity:0, y:8 }}
                          animate={{ opacity:1, y:0 }}
                          exit={{ opacity:0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className="group hover:bg-white/60 dark:hover:bg-dark-800/30 transition-colors duration-150 cursor-default"
                        >
                          {/* ID + date */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <code className="text-[11px] font-mono font-semibold text-slate-400 dark:text-dark-500 group-hover:text-brand-500 transition-colors">
                                {app.id.substring(0,8)}…
                              </code>
                              <button onClick={() => copyId(app.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-brand-500 transition-all">
                                {copiedId === app.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-dark-600 flex items-center gap-1 mt-0.5 font-medium">
                              <Calendar size={10} />
                              {new Date(app.created_at).toLocaleDateString('en-IN',{ month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                            </span>
                          </td>

                          {/* Applicant */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-semibold text-slate-800 dark:text-dark-100 text-[13px] truncate max-w-[140px]">{app.applicant_name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-dark-500 truncate max-w-[140px] mt-0.5">{app.loan_purpose}</p>
                          </td>

                          {/* Mobile */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-mono text-[12px] font-semibold text-slate-600 dark:text-dark-300">{app.mobile_number}</span>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-display font-bold text-slate-800 dark:text-dark-100">
                              ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Language */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${lc.bg} ${lc.text} ${lc.border}`}>
                              {app.preferred_language}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`badge-${app.status}`}>
                              {app.status === 'approved' && <CheckCircle2 size={11} />}
                              {app.status === 'rejected' && <XCircle size={11} />}
                              {app.status === 'pending'  && <Clock size={11} className="animate-pulse-glow" />}
                              <span className="capitalize">{app.status}</span>
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <motion.button
                              whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                              onClick={() => setModalApp(app)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                                border border-slate-200/60 dark:border-dark-700/60
                                bg-white/60 dark:bg-dark-800/60
                                hover:border-brand-500/40 hover:bg-brand-500/5
                                text-slate-600 dark:text-dark-300 text-xs font-semibold transition-all duration-150">
                              <ArrowRightLeft size={11} /> Update
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5
              border-t border-slate-100/60 dark:border-dark-800/40
              bg-slate-50/50 dark:bg-dark-900/40 backdrop-blur-sm text-xs font-semibold">
              <span className="text-slate-400 dark:text-dark-500">
                Page {pagination.page} of {pagination.pages} · {pagination.total} entries
              </span>
              <div className="flex gap-1.5">
                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                  disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200/60 dark:border-dark-700/60 bg-white/60 dark:bg-dark-800/60
                    text-slate-500 dark:text-dark-400 disabled:opacity-30 transition-opacity">
                  <ChevronLeft size={14} />
                </motion.button>
                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                  disabled={page >= pagination.pages || loading} onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200/60 dark:border-dark-700/60 bg-white/60 dark:bg-dark-800/60
                    text-slate-500 dark:text-dark-400 disabled:opacity-30 transition-opacity">
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Status Modal ──────────────────────────────── */}
      <AnimatePresence>
        {modalApp && (
          <>
            <motion.div key="modal-bg"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setModalApp(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

            <motion.div key="modal"
              initial={{ opacity:0, scale:0.94, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.94, y:20 }}
              transition={{ type:'spring', stiffness:340, damping:28 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit z-50
                glass-panel bg-white/95 dark:bg-dark-900/95
                rounded-2xl border border-white/50 dark:border-white/[0.06]
                shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">

              {/* Top accent */}
              <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#e8184a,#a80933)' }} />

              <div className="p-6">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-slate-800 dark:text-dark-100 flex items-center gap-2">
                    <Activity size={16} className="text-brand-500" /> Update Application Status
                  </h3>
                  <motion.button whileHover={{ scale:1.1, rotate:90 }} whileTap={{ scale:0.9 }}
                    onClick={() => setModalApp(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-600 transition-all">
                    <XCircle size={16} />
                  </motion.button>
                </div>

                {/* Applicant info */}
                <div className="rounded-xl p-4 mb-5
                  bg-slate-50/80 dark:bg-dark-950/60
                  border border-slate-200/60 dark:border-dark-800/60 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-dark-600 mb-1">Applicant</p>
                    <p className="font-display font-bold text-slate-800 dark:text-dark-100 text-base">{modalApp.applicant_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-dark-600 mb-1">Loan Amount</p>
                      <p className="font-display font-bold text-slate-800 dark:text-dark-100">₹{parseFloat(modalApp.loan_amount).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-dark-600 mb-1">Current Status</p>
                      <span className={`badge-${modalApp.status} capitalize`}>{modalApp.status}</span>
                    </div>
                  </div>
                </div>

                {/* Status buttons */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-dark-600 mb-3">Choose New Status</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      s: 'pending',
                      label: 'Pending',
                      Icon: Clock,
                      activeClass: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                      iconColor: 'text-amber-500',
                    },
                    {
                      s: 'approved',
                      label: 'Approve',
                      Icon: CheckCircle2,
                      activeClass: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      iconColor: 'text-emerald-500',
                    },
                    {
                      s: 'rejected',
                      label: 'Reject',
                      Icon: XCircle,
                      activeClass: 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400',
                      iconColor: 'text-rose-500',
                    },
                  ].map(({ s, label, Icon, activeClass, iconColor }) => {
                    const active = modalApp.status === s;
                    return (
                      <motion.button key={s}
                        whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                        onClick={() => handleStatusUpdate(modalApp.id, s)}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 rounded-xl
                          border font-semibold text-sm transition-all duration-200 ${
                          active
                            ? `${activeClass} shadow-sm`
                            : 'border-slate-200/60 dark:border-dark-700/50 bg-white/40 dark:bg-dark-800/40 text-slate-500 dark:text-dark-400 hover:border-slate-300 dark:hover:border-dark-600'
                        }`}>
                        <Icon size={18} className={active ? iconColor : ''} />
                        <span className="text-[12px]">{label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <button onClick={() => setModalApp(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold
                    border border-slate-200/60 dark:border-dark-700/50
                    bg-slate-50/50 dark:bg-dark-800/40
                    text-slate-600 dark:text-dark-300
                    hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
