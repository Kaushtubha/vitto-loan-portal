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
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

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
        return <Clock className="w-3.5 h-3.5 mr-1.5 animation-pulse" />;
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

  // Theme-aware Tooltip Styling
  const isDark = theme === 'dark';
  const tooltipContentStyle = {
    background: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '10px',
    boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.05)',
    fontSize: '11px',
  };
  const tooltipItemStyle = {
    color: isDark ? '#ffffff' : '#0f172a',
  };
  const tooltipLabelStyle = {
    color: isDark ? '#9ca3af' : '#64748b',
  };

  return (
    <div className="space-y-5">
      
      {/* Header and Toolbar - Compact layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-brand-500 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Operations Dashboard</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Overview Analytics
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-500 dark:text-dark-400 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-800 text-xs font-bold text-slate-700 dark:text-dark-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => navigate('/apply')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-premium text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Compact Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Applications */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden transition-transform duration-200 hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-2 opacity-5 text-brand-500">
            <Layers className="w-12 h-12" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Total Applications</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 block">
            {summary.totalApplications}
          </span>
          <span className="text-[10px] text-brand-500 font-semibold mt-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Underwriting pipeline
          </span>
        </div>

        {/* Requested Capital */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden transition-transform duration-200 hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-2 opacity-5 text-indigo-500">
            <TrendingUp className="w-12 h-12" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Requested Amount</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 block">
            ₹{summary.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-indigo-500 font-semibold mt-2 block">
            Avg: ₹{summary.totalApplications > 0 ? Math.round(summary.totalAmount / summary.totalApplications).toLocaleString('en-IN') : 0}
          </span>
        </div>

        {/* Approved Capital */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden transition-transform duration-200 hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-2 opacity-5 text-emerald-500">
            <UserCheck className="w-12 h-12" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Approved Volume</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 block">
            ₹{summary.approvedAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {summary.statusCounts?.approved || 0} approved
          </span>
        </div>

        {/* Pending / Rejected counts */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden transition-transform duration-200 hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-2 opacity-5 text-amber-500">
            <Clock className="w-12 h-12" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Pending Reviews</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 block">
            {summary.statusCounts?.pending || 0}
          </span>
          <div className="text-[10px] mt-2 flex justify-between">
            <span className="text-amber-500 font-semibold flex items-center">
              <Clock className="w-3 h-3 mr-0.5" /> {summary.statusCounts?.pending || 0} Pending
            </span>
            <span className="text-rose-500 font-semibold flex items-center">
              <XCircle className="w-3 h-3 mr-0.5" /> {summary.statusCounts?.rejected || 0} Rejected
            </span>
          </div>
        </div>

      </div>

      {/* Compact Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Line Area Chart (h-60 / 240px) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-dark-800/40 flex flex-col h-60">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Capital Demand Curve
            </h3>
          </div>
          <div className="flex-1 w-full text-[10px] font-semibold">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6b7280" opacity={0.4} tickLine={false} />
                  <YAxis stroke="#6b7280" opacity={0.4} tickLine={false} />
                  <Tooltip 
                    contentStyle={tooltipContentStyle} 
                    itemStyle={tooltipItemStyle}
                    labelStyle={tooltipLabelStyle}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Submit applications to show metrics.
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart (h-60 / 240px) */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-dark-800/40 flex flex-col h-60">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-brand-500" />
              Language Demographics
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {summary.languageDistribution?.length > 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.languageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {summary.languageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(17, 24, 39, 0.95)', 
                          border: 'none', 
                          borderRadius: '8px',
                        }} 
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-2 w-full text-[9px] font-semibold text-center">
                  {summary.languageDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
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
      <div className="space-y-3">
        
        {/* Table Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 glass-card rounded-2xl border border-slate-200/50 dark:border-dark-800/40">
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute inset-y-0 left-3 w-4 h-4 my-auto text-slate-400 dark:text-dark-500" />
            <input
              type="text"
              placeholder="Search by applicant or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-dark-800/60 bg-slate-50/50 dark:bg-dark-950/20 text-xs outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2 justify-end">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Filter className="w-3 h-3" />
              <span>Status</span>
            </div>
            
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-dark-800/60 bg-slate-50/50 dark:bg-dark-950/20 text-xs outline-none focus:border-brand-500 appearance-none font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Applications Table Card */}
        <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-dark-800/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-dark-800/40">
              <thead className="bg-slate-50/50 dark:bg-dark-900/30">
                <tr>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">ID / Date</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Applicant</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Mobile</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Amount (₹)</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Language</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Status</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-200/50 dark:divide-dark-800/40 text-xs">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`}>
                        <td className="px-5 py-3"><div className="h-3.5 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-20"></div></td>
                        <td className="px-5 py-3"><div className="h-3.5 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-28"></div></td>
                        <td className="px-5 py-3"><div className="h-3.5 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-5 py-3"><div className="h-3.5 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-5 py-3"><div className="h-3.5 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-12"></div></td>
                        <td className="px-5 py-3"><div className="h-5.5 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-5 py-3 text-right"><div className="h-7 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-dark-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Layers className="w-8 h-8 stroke-[1.5] text-slate-300 dark:text-dark-700" />
                          <p className="font-bold text-xs">No loan applications found</p>
                          <p className="text-[10px] text-slate-400 dark:text-dark-500">Adjust filters or apply for a new loan.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="hover:bg-slate-50/50 dark:hover:bg-dark-900/10 transition-colors"
                      >
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <code className="text-[10px] font-bold font-mono text-slate-500 dark:text-dark-400 select-all">
                                {app.id.substring(0, 8)}...
                              </code>
                              <button
                                onClick={() => copyId(app.id)}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                              >
                                {copiedId === app.id ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-[9px] text-slate-400 dark:text-dark-500 flex items-center font-medium gap-0.5">
                              <Calendar className="w-2.5 h-2.5" />
                              {new Date(app.created_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="font-bold text-slate-800 dark:text-dark-100 block truncate max-w-[140px]" title={app.applicant_name}>
                            {app.applicant_name}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400 dark:text-dark-500 block truncate max-w-[140px]" title={app.loan_purpose}>
                            {app.loan_purpose}
                          </span>
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap font-mono text-[11px] font-bold text-slate-600 dark:text-dark-300">
                          {app.mobile_number}
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap font-extrabold text-slate-800 dark:text-dark-100">
                          ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${getLanguageBadgeColor(app.preferred_language)}`}>
                            {app.preferred_language}
                          </span>
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="capitalize">{app.status}</span>
                          </span>
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap text-right text-xs font-semibold">
                          <button
                            onClick={() => setSelectedAppForStatus(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-800 text-[10px] font-bold text-slate-600 dark:text-dark-300 transition-colors shadow-sm"
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
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/50 dark:border-dark-800/40 bg-slate-50/50 dark:bg-dark-900/30 text-[10px] font-bold">
              <span className="text-slate-500 dark:text-dark-400">
                Page {pagination.page} of {pagination.pages} ({pagination.total} entries)
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1 rounded-lg border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-600 dark:text-dark-300 disabled:opacity-40 transition-opacity hover:bg-slate-50 dark:hover:bg-dark-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentPage >= pagination.pages || loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1 rounded-lg border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-600 dark:text-dark-300 disabled:opacity-40 transition-opacity hover:bg-slate-50 dark:hover:bg-dark-800"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
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
              className="fixed inset-0 m-auto w-full max-w-sm h-fit glass-card bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-600 to-indigo-600" />
              
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-dark-100">
                  Update Application Status
                </h3>
                <button
                  onClick={() => setSelectedAppForStatus(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 dark:text-dark-505"
                >
                  <XCircle className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-dark-950 rounded-xl p-3 border border-slate-200/50 dark:border-dark-850/50 text-[10px] space-y-1.5 mb-4">
                <div>
                  <span className="text-slate-400 dark:text-dark-500 block uppercase font-semibold">Applicant Name</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-dark-200">{selectedAppForStatus.applicant_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 dark:text-dark-500 block uppercase font-semibold">Amount</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-dark-200">₹{parseFloat(selectedAppForStatus.loan_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-dark-500 block uppercase font-semibold">Current Status</span>
                    <span className="text-xs font-bold capitalize text-brand-500 dark:text-brand-400">{selectedAppForStatus.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest">
                  Choose Status
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'pending')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedAppForStatus.status === 'pending'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-850'
                    }`}
                  >
                    <Clock className="w-4.5 h-4.5 mb-1" />
                    Pending
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'approved')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedAppForStatus.status === 'approved'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-850'
                    }`}
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 mb-1" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'rejected')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedAppForStatus.status === 'rejected'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm'
                        : 'border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-850'
                    }`}
                  >
                    <XCircle className="w-4.5 h-4.5 mb-1" />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-dark-800 flex gap-2">
                <button
                  onClick={() => setSelectedAppForStatus(null)}
                  className="w-full py-2 rounded-xl border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-800 text-[10px] font-bold text-slate-700 dark:text-dark-300 transition-colors"
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
