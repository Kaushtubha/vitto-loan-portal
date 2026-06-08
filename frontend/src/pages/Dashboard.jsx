import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Search, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  UserCheck, 
  RefreshCw, 
  Sparkles,
  Calendar,
  Layers,
  Activity,
  ArrowRightLeft,
  Languages
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

// Smooth animated count up for numbers/currencies
function AnimatedCounter({ value, duration = 800, formatter = (v) => v }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endVal = parseFloat(value);
    if (isNaN(endVal)) {
      setCurrent(value);
      return;
    }
    
    const startVal = 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      setCurrent(startVal + easedProgress * (endVal - startVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(endVal);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{formatter(current)}</span>;
}

// Recharts Custom Area Tooltip (High contrast, readable in both light and dark modes)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-black/90 backdrop-blur-md border border-white/20 dark:border-white/10 p-3.5 rounded-2xl shadow-2xl text-xs font-semibold text-white">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</div>
        <div className="text-base font-extrabold text-indigo-400 font-sans">
          ₹{parseFloat(payload[0].value).toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
};

// Recharts Custom Pie Tooltip (High contrast, readable in both light and dark modes)
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 dark:bg-black/90 backdrop-blur-md border border-white/20 dark:border-white/10 p-3.5 rounded-2xl shadow-2xl text-xs font-semibold text-white">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{data.name}</div>
        <div className="text-sm font-extrabold text-indigo-400">
          {data.value} {data.value === 1 ? 'Application' : 'Applications'}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { 
    applications, 
    summary, 
    pagination, 
    loading, 
    fetchApplications, 
    fetchSummary, 
    updateStatus,
    theme
  } = useStore();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [copiedId, setCopiedId] = useState(null);
  const [selectedAppForStatus, setSelectedAppForStatus] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchApplications({
      status: statusFilter,
      search: debouncedSearch,
      page: currentPage,
      limit: 6, // Compact view: 6 items per page
    });
  }, [statusFilter, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleRefresh = () => {
    fetchSummary();
    fetchApplications({
      status: statusFilter,
      search: debouncedSearch,
      page: currentPage,
      limit: 6,
    });
    toast.success('Metrics refreshed');
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('ID copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
      case 'rejected':
        return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return <Clock className="w-3.5 h-3.5 mr-1.5 animate-pulse" />;
    }
  };

  const getLanguageBadgeColor = (lang) => {
    switch (lang) {
      case 'Hindi':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20';
      case 'Tamil':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      case 'Telugu':
        return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20';
      case 'Marathi':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await updateStatus(id, status);
    setSelectedAppForStatus(null);
  };

  const exportToCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export');
      return;
    }
    const headers = ['Application ID', 'Applicant Name', 'Mobile Number', 'Loan Amount', 'Loan Purpose', 'Language', 'Status', 'Applied At'];
    const rows = applications.map(app => [
      app.id,
      app.applicant_name,
      app.mobile_number,
      app.loan_amount,
      `"${app.loan_purpose.replace(/"/g, '""')}"`,
      app.preferred_language,
      app.status,
      new Date(app.created_at).toLocaleString('en-IN')
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vitto_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Downloaded');
  };

  const chartData = summary.recentApplications?.slice().reverse().map(app => ({
    date: new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(app.loan_amount)
  })) || [];

  return (
    <div className="space-y-6">
      
      {/* Header and Toolbar - Compact layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-brand-500 dark:text-brand-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Operations Center</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-slate-900 via-brand-950 to-brand-600 dark:from-white dark:via-dark-100 dark:to-brand-400 bg-clip-text text-transparent">
            Overview Analytics
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-500 dark:text-dark-400 transition-all duration-300 shadow-sm"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/[0.08] text-xs font-bold text-slate-700 dark:text-dark-200 transition-all duration-300 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => navigate('/apply')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-premium text-xs font-bold transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Applications */}
        <div className="glass-card hover-lift rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 text-brand-500">
            <Layers className="w-16 h-16" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Total Applications</span>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 block">
            <AnimatedCounter value={summary.totalApplications} formatter={(v) => Math.round(v).toString()} />
          </span>
          <span className="text-[10px] text-brand-500 font-semibold mt-3.5 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Underwriting pipeline
          </span>
        </div>

        {/* Requested Capital */}
        <div className="glass-card hover-lift rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 text-indigo-500">
            <TrendingUp className="w-16 h-16" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Requested Amount</span>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 block">
            <AnimatedCounter value={summary.totalAmount} formatter={(v) => '₹' + Math.round(v).toLocaleString('en-IN')} />
          </span>
          <span className="text-[10px] text-indigo-500 font-semibold mt-3.5 block">
            Avg: ₹{summary.totalApplications > 0 ? Math.round(summary.totalAmount / summary.totalApplications).toLocaleString('en-IN') : 0}
          </span>
        </div>

        {/* Approved Capital */}
        <div className="glass-card hover-lift rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 text-emerald-500">
            <UserCheck className="w-16 h-16" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Approved Volume</span>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 block">
            <AnimatedCounter value={summary.approvedAmount} formatter={(v) => '₹' + Math.round(v).toLocaleString('en-IN')} />
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold mt-3.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {summary.statusCounts?.approved || 0} approved
          </span>
        </div>

        {/* Pending / Rejected counts */}
        <div className="glass-card hover-lift rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 text-amber-500">
            <Clock className="w-16 h-16" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Pending Reviews</span>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 block">
            <AnimatedCounter value={summary.statusCounts?.pending || 0} formatter={(v) => Math.round(v).toString()} />
          </span>
          <div className="text-[10px] mt-3.5 flex justify-between items-center">
            <span className="text-amber-500 font-semibold flex items-center">
              <Clock className="w-3 h-3 mr-1" /> {summary.statusCounts?.pending || 0} Pending
            </span>
            <span className="text-rose-500 font-semibold flex items-center">
              <XCircle className="w-3 h-3 mr-1" /> {summary.statusCounts?.rejected || 0} Rejected
            </span>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Main Line Area Chart */}
        <div className="xl:col-span-2 glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/50 dark:border-dark-800/40 flex flex-col h-72 hover-lift">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Capital Demand Curve
            </h3>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Timeline view</span>
          </div>
          
          <div className="flex-1 w-full text-[10px] font-semibold min-h-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" opacity={0.6} tickLine={false} />
                  <YAxis stroke="#6b7280" opacity={0.6} tickLine={false} />
                  <Tooltip 
                    content={<CustomTooltip />}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Submit applications to show metrics.
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/50 dark:border-dark-800/40 flex flex-col h-72 hover-lift">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Languages className="w-4 h-4 text-brand-500" />
              Language Demographics
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
            {summary.languageDistribution?.length > 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-[140px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.languageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {summary.languageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3 w-full text-[9px] font-semibold text-center max-h-[50px] overflow-y-auto">
                  {summary.languageDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1 justify-center">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate text-slate-500 dark:text-dark-400">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs">No language preference data.</div>
            )}
          </div>
        </div>

      </div>

      {/* Applications Table Section */}
      <div className="space-y-4">
        
        {/* Table Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-card rounded-3xl border border-slate-200/50 dark:border-dark-800/40">
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute inset-y-0 left-3.5 w-4 h-4 my-auto text-slate-400 dark:text-dark-500" />
            <input
              type="text"
              placeholder="Search by applicant name or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-xs outline-none focus:border-brand-500 dark:focus:border-brand-400 transition-colors duration-300"
            />
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3 justify-end">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-dark-500 text-[10px] font-bold uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5" />
              <span>Status</span>
            </div>
            
            <div className="relative w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-xs outline-none focus:border-brand-500 dark:focus:border-brand-400 appearance-none font-bold text-slate-700 dark:text-dark-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Applications Table Card */}
        <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-dark-800/40 overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-white/[0.06]">
              <thead className="bg-slate-100/30 dark:bg-white/[0.01]">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">ID / Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Applicant</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Mobile</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Amount (₹)</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Language</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/[0.06] text-xs">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`}>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-28"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-12"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-dark-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                          <Layers className="w-10 h-10 stroke-[1.5] text-slate-300 dark:text-dark-700 animate-pulse" />
                          <p className="font-bold text-sm text-slate-700 dark:text-dark-300">No loan applications found</p>
                          <p className="text-xs text-slate-400 dark:text-dark-500">Adjust filters or apply for a new loan.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        layout
                        className="hover:bg-slate-100/30 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <code className="text-[10px] font-bold font-mono text-slate-500 dark:text-dark-400 select-all bg-slate-200/50 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                                {app.id.substring(0, 8)}...
                              </code>
                              <button
                                onClick={() => copyId(app.id)}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
                                title="Copy Reference ID"
                              >
                                {copiedId === app.id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-dark-200" />
                                )}
                              </button>
                            </div>
                            <span className="text-[9px] text-slate-400 dark:text-dark-500 flex items-center font-medium gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(app.created_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800 dark:text-dark-100 block truncate max-w-[160px]" title={app.applicant_name}>
                            {app.applicant_name}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400 dark:text-dark-500 block truncate max-w-[160px]" title={app.loan_purpose}>
                            {app.loan_purpose}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-600 dark:text-dark-300">
                          {app.mobile_number}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-extrabold text-slate-800 dark:text-dark-100">
                          ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${getLanguageBadgeColor(app.preferred_language)}`}>
                            {app.preferred_language}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="capitalize">{app.status}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold">
                          <button
                            onClick={() => setSelectedAppForStatus(app)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] text-[10px] font-bold text-slate-700 dark:text-dark-200 transition-colors shadow-sm"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            Update
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/50 dark:border-white/[0.06] bg-slate-100/10 dark:bg-white/[0.01] text-[10px] font-bold">
              <span className="text-slate-500 dark:text-dark-400">
                Page {pagination.page} of {pagination.pages} ({pagination.total} entries)
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200/50 dark:border-white/10 bg-white dark:bg-dark-950 text-slate-600 dark:text-dark-300 disabled:opacity-40 transition-opacity hover:bg-slate-100 dark:hover:bg-dark-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= pagination.pages || loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200/50 dark:border-white/10 bg-white dark:bg-dark-950 text-slate-600 dark:text-dark-300 disabled:opacity-40 transition-opacity hover:bg-slate-100 dark:hover:bg-dark-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {selectedAppForStatus && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppForStatus(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit glass-card bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-600 to-indigo-600" />
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-dark-100 uppercase tracking-wider">
                  Update Application Status
                </h3>
                <button
                  onClick={() => setSelectedAppForStatus(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 dark:text-dark-500 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-100/60 dark:bg-white/[0.02] rounded-2xl p-4 border border-slate-200/50 dark:border-white/[0.05] text-xs space-y-2 mb-5">
                <div>
                  <span className="text-slate-400 dark:text-dark-500 block uppercase font-bold tracking-wider text-[9px]">Applicant Name</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-dark-100">{selectedAppForStatus.applicant_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-slate-400 dark:text-dark-500 block uppercase font-bold tracking-wider text-[9px]">Amount</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-dark-100">₹{parseFloat(selectedAppForStatus.loan_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-dark-500 block uppercase font-bold tracking-wider text-[9px]">Current Status</span>
                    <span className="text-sm font-extrabold capitalize text-brand-500 dark:text-brand-400">{selectedAppForStatus.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest">
                  Choose Status
                </span>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'pending')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                      selectedAppForStatus.status === 'pending'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-glow'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-100/50 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <Clock className="w-5 h-5 mb-1.5 text-amber-500" />
                    Pending
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'approved')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                      selectedAppForStatus.status === 'approved'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-glow'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-100/50 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mb-1.5 text-emerald-500" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'rejected')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                      selectedAppForStatus.status === 'rejected'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-glow'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-100/50 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <XCircle className="w-5 h-5 mb-1.5 text-rose-500" />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/[0.06] flex gap-3">
                <button
                  onClick={() => setSelectedAppForStatus(null)}
                  className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-dark-800 text-xs font-bold text-slate-600 dark:text-dark-300 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
