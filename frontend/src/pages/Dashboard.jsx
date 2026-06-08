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
  ArrowRightLeft
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

// Colors for the Pie Chart
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

export default function Dashboard() {
  const { 
    applications, 
    summary, 
    pagination, 
    loading, 
    fetchApplications, 
    fetchSummary, 
    updateStatus 
  } = useStore();

  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // UI Helpers
  const [copiedId, setCopiedId] = useState(null);
  const [selectedAppForStatus, setSelectedAppForStatus] = useState(null);

  // Sync debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // reset to page 1 on new search
    }, 450);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load applications and summary statistics on mount and when filters/page changes
  useEffect(() => {
    fetchApplications({
      status: statusFilter,
      search: debouncedSearch,
      page: currentPage,
      limit: 7,
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
      limit: 7,
    });
    toast.success('Dashboard metrics updated');
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Application ID copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Status badge style helper
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

  // Language badge color mapping (Bonus Feature: Language-based color badges)
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
      default: // English
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    }
  };

  // Handle status update change from the modal
  const handleStatusUpdate = async (id, status) => {
    await updateStatus(id, status);
    setSelectedAppForStatus(null);
  };

  // Export to CSV helper (Bonus Feature)
  const exportToCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications available to export.');
      return;
    }
    
    // Header definition
    const headers = ['Application ID', 'Applicant Name', 'Mobile Number', 'Loan Amount (INR)', 'Loan Purpose', 'Language', 'Status', 'Applied At'];
    
    // Map applications array to CSV rows
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
    
    // Create download link element
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vitto_applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Export downloaded successfully');
  };

  // Chart Details Helpers
  const chartData = summary.recentApplications?.slice().reverse().map(app => ({
    date: new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(app.loan_amount)
  })) || [];

  return (
    <div className="space-y-8">
      
      {/* Header and Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-500 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            <span>Operational Center</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-600 dark:from-white dark:via-dark-100 dark:to-brand-400 bg-clip-text text-transparent">
            Overview Analytics
          </h2>
          <p className="text-slate-500 dark:text-dark-400 text-sm">
            Monitor incoming loan submissions, approve requests, and evaluate portfolio trends.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors shadow-sm text-slate-500 dark:text-dark-400"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors shadow-sm text-sm font-semibold text-slate-700 dark:text-dark-300"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => navigate('/apply')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-premium text-sm font-semibold transition-colors"
          >
            <Plus className="w-4.5 h-4.5" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Applications Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20 text-brand-500">
            <Layers className="w-16 h-16" />
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Total Applications</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {summary.totalApplications}
            </span>
          </div>
          <div className="mt-4 flex items-center text-xs text-brand-500 font-semibold gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Active underwriting pipeline</span>
          </div>
        </div>

        {/* Total Loan Amount Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20 text-indigo-500">
            <TrendingUp className="w-16 h-16" />
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Requested Amount</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xs font-extrabold text-indigo-500 select-none">₹</span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {summary.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-4 flex items-center text-xs text-indigo-500 font-semibold gap-1">
            <span>Average: ₹{summary.totalApplications > 0 ? Math.round(summary.totalAmount / summary.totalApplications).toLocaleString('en-IN') : 0}</span>
          </div>
        </div>

        {/* Approved Capital Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20 text-emerald-500">
            <UserCheck className="w-16 h-16" />
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Approved Volume</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xs font-extrabold text-emerald-500 select-none">₹</span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {summary.approvedAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-500 font-semibold gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{summary.statusCounts?.approved || 0} applications approved</span>
          </div>
        </div>

        {/* Status Counts Breakdown Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-dark-800/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20 text-amber-500">
            <Clock className="w-16 h-16" />
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-widest block">Pending Reviews</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {summary.statusCounts?.pending || 0}
            </span>
          </div>
          <div className="mt-4 flex items-center text-xs justify-between gap-1">
            <span className="text-amber-500 font-semibold flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {summary.statusCounts?.pending || 0} Pending
            </span>
            <span className="text-rose-500 font-semibold flex items-center">
              <XCircle className="w-3.5 h-3.5 mr-1" />
              {summary.statusCounts?.rejected || 0} Rejected
            </span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Line Area Chart (Recharts) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-dark-800/40 flex flex-col h-80">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-dark-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Capital Demand Curve
            </h3>
            <p className="text-xs text-slate-400 dark:text-dark-500">Amount requested in recent loan applications</p>
          </div>
          <div className="flex-1 w-full text-xs font-semibold">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6b7280" opacity={0.5} tickLine={false} />
                  <YAxis stroke="#6b7280" opacity={0.5} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(17, 24, 39, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Submit applications to generate graphs.
              </div>
            )}
          </div>
        </div>

        {/* Language Preference Pie Chart (Recharts) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-dark-800/40 flex flex-col h-80">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-dark-100 flex items-center gap-2">
              <Languages className="w-4.5 h-4.5 text-brand-500" />
              Language Demographics
            </h3>
            <p className="text-xs text-slate-400 dark:text-dark-500">Borrower preferred communication channels</p>
          </div>
          <div className="flex-1 flex items-center justify-center text-xs font-semibold relative">
            {summary.languageDistribution?.length > 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.languageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {summary.languageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(17, 24, 39, 0.9)', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legends */}
                <div className="grid grid-cols-3 gap-2 mt-2 w-full text-[10px]">
                  {summary.languageDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1.5 justify-center">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate text-slate-500 dark:text-dark-400 font-medium">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-400">No demographic data available.</div>
            )}
          </div>
        </div>

      </div>

      {/* Applications List Table Section */}
      <div className="space-y-4">
        
        {/* Table Filters header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-card rounded-2xl border border-slate-200/50 dark:border-dark-800/40">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute inset-y-0 left-3.5 w-4 h-4 my-auto text-slate-400 dark:text-dark-500" />
            <input
              type="text"
              placeholder="Search by applicant or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800/60 bg-slate-50/50 dark:bg-dark-950/20 text-sm outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Status Dropdowns */}
          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider select-none">
              <Filter className="w-3.5 h-3.5" />
              <span>Status</span>
            </div>
            
            <div className="relative w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // reset to page 1
                }}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800/60 bg-slate-50/50 dark:bg-dark-950/20 text-sm outline-none focus:border-brand-500 appearance-none"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Table list */}
        <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-dark-800/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-dark-800/40">
              <thead className="bg-slate-50/50 dark:bg-dark-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">ID / Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Amount (₹)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Language</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-200/50 dark:divide-dark-800/40 text-sm">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`}>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-20"></div></td>
                        <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 dark:bg-dark-800 rounded animate-pulse w-16 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-dark-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Layers className="w-10 h-10 stroke-[1.5] text-slate-300 dark:text-dark-700" />
                          <p className="font-semibold text-sm">No loan applications found</p>
                          <p className="text-xs text-slate-400 dark:text-dark-500 max-w-xs">Adjust your search/filters or submit a new application to see data here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Table Rows
                    applications.map((app) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="hover:bg-slate-50/50 dark:hover:bg-dark-900/10 transition-colors"
                      >
                        {/* ID and Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <code className="text-[11px] font-semibold font-mono text-slate-500 dark:text-dark-400 select-all">
                                {app.id.substring(0, 8)}...
                              </code>
                              <button
                                onClick={() => copyId(app.id)}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                                title="Copy full application ID"
                              >
                                {copiedId === app.id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-dark-500 flex items-center font-medium gap-1">
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

                        {/* Applicant Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 dark:text-dark-100 block truncate max-w-[150px]" title={app.applicant_name}>
                            {app.applicant_name}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-dark-500 block truncate max-w-[150px]" title={app.loan_purpose}>
                            {app.loan_purpose}
                          </span>
                        </td>

                        {/* Mobile Number */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-600 dark:text-dark-300">
                          {app.mobile_number}
                        </td>

                        {/* Loan Amount */}
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800 dark:text-dark-100">
                          ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                        </td>

                        {/* Language */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getLanguageBadgeColor(app.preferred_language)}`}>
                            {app.preferred_language}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="capitalize">{app.status}</span>
                          </span>
                        </td>

                        {/* Action Status Update Trigger */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold">
                          <button
                            onClick={() => setSelectedAppForStatus(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-dark-300 transition-colors shadow-sm"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Update Status
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Table Pagination footer (Bonus Feature) */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/50 dark:border-dark-800/40 bg-slate-50/50 dark:bg-dark-900/30 text-xs font-semibold">
              <span className="text-slate-500 dark:text-dark-400">
                Page {pagination.page} of {pagination.pages} ({pagination.total} entries)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-600 dark:text-dark-300 disabled:opacity-40 transition-opacity hover:bg-slate-50 dark:hover:bg-dark-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= pagination.pages || loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-600 dark:text-dark-300 disabled:opacity-40 transition-opacity hover:bg-slate-50 dark:hover:bg-dark-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal (Overlay) */}
      <AnimatePresence>
        {selectedAppForStatus && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppForStatus(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit glass-card bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-600 to-indigo-600" />
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-dark-100">
                  Update Application Status
                </h3>
                <button
                  onClick={() => setSelectedAppForStatus(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 dark:text-dark-500"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Context */}
              <div className="bg-slate-50 dark:bg-dark-950 rounded-xl p-4 border border-slate-200/50 dark:border-dark-850/50 text-xs space-y-2 mb-6">
                <div>
                  <span className="text-slate-400 dark:text-dark-500 block uppercase tracking-wider font-semibold">Applicant Name</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-dark-200">{selectedAppForStatus.applicant_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-slate-400 dark:text-dark-500 block uppercase tracking-wider font-semibold">Amount</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-dark-200">₹{parseFloat(selectedAppForStatus.loan_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-dark-500 block uppercase tracking-wider font-semibold">Current Status</span>
                    <span className="text-sm font-bold capitalize text-brand-500 dark:text-brand-400">{selectedAppForStatus.status}</span>
                  </div>
                </div>
              </div>

              {/* Action Toggles */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-widest">
                  Choose Status
                </span>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'pending')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedAppForStatus.status === 'pending'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-850'
                    }`}
                  >
                    <Clock className="w-5 h-5 mb-1" />
                    Pending
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'approved')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedAppForStatus.status === 'approved'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-850'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mb-1" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppForStatus.id, 'rejected')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedAppForStatus.status === 'rejected'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm'
                        : 'border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-850'
                    }`}
                  >
                    <XCircle className="w-5 h-5 mb-1" />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-dark-800 flex gap-3">
                <button
                  onClick={() => setSelectedAppForStatus(null)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-800 text-xs font-semibold text-slate-700 dark:text-dark-300 transition-colors"
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
