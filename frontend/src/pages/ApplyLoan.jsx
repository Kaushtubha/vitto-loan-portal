import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  User, Phone, Coins, Languages, FileText, Copy, Check,
  ArrowLeft, Sparkles, Loader2, CheckCircle2, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { value: 'English', label: 'English',           flag: '🇬🇧' },
  { value: 'Hindi',   label: 'Hindi (हिंदी)',     flag: '🇮🇳' },
  { value: 'Tamil',   label: 'Tamil (தமிழ்)',     flag: '🌟' },
  { value: 'Telugu',  label: 'Telugu (తెలుగు)',   flag: '🌟' },
  { value: 'Marathi', label: 'Marathi (मराठी)',   flag: '🌟' },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

function FieldError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p initial={{ opacity:0, y:-4, height:0 }} animate={{ opacity:1, y:0, height:'auto' }}
          exit={{ opacity:0, y:-4, height:0 }} transition={{ duration:0.18 }}
          className="text-[11px] font-semibold text-red-500 pl-1 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full shrink-0" />{msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function ApplyLoan() {
  const { createApplication, loading } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    applicant_name: '', mobile_number: '', loan_amount: '',
    loan_purpose: '', preferred_language: '',
  });
  const [errors,   setErrors]   = useState({});
  const [success,  setSuccess]  = useState(null);
  const [copied,   setCopied]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.applicant_name.trim())        e.applicant_name   = 'Name is required';
    else if (form.applicant_name.trim().length < 2) e.applicant_name = 'Name must be at least 2 characters';

    if (!form.mobile_number.trim())         e.mobile_number    = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile_number.trim())) e.mobile_number = 'Enter a valid 10-digit Indian mobile number';

    const amt = parseFloat(form.loan_amount);
    if (!form.loan_amount)                  e.loan_amount      = 'Loan amount is required';
    else if (isNaN(amt) || amt <= 0)        e.loan_amount      = 'Enter a valid amount greater than ₹0';
    else if (amt > 100000000)               e.loan_amount      = 'Amount cannot exceed ₹10 Cr';

    if (!form.loan_purpose.trim())          e.loan_purpose     = 'Purpose is required';
    else if (form.loan_purpose.trim().length < 5) e.loan_purpose = 'Please describe the purpose in at least 5 characters';

    if (!form.preferred_language)          e.preferred_language = 'Please select a language';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below.'); return; }
    try {
      const res = await createApplication({ ...form, loan_amount: parseFloat(form.loan_amount) });
      if (res) {
        setSuccess(res);
        setForm({ applicant_name:'', mobile_number:'', loan_amount:'', loan_purpose:'', preferred_language:'' });
      }
    } catch {}
  };

  const copyId = () => {
    navigator.clipboard.writeText(success.id);
    setCopied(true);
    toast.success('Application ID copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-xl mx-auto py-2">
      <AnimatePresence mode="wait">

        {/* ── Form ─────────────────────────────────────── */}
        {!success && (
          <motion.div key="form"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}>

            {/* Page header */}
            <div className="mb-7 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles size={12} className="text-brand-500 animate-pulse-glow" />
                <span className="text-[11px] font-display font-bold tracking-[0.15em] text-brand-500 uppercase text-glow">
                  Quick Application
                </span>
              </div>
              <h2 className="text-gradient-hero font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none">
                Apply for a Loan
              </h2>
              <p className="text-slate-500 dark:text-dark-400 text-sm mt-2">
                Complete the form below. Standard review completes within 24 hours.
              </p>
            </div>

            {/* Card */}
            <div className="glass-panel rounded-3xl relative overflow-hidden
              border border-white/50 dark:border-white/[0.05] shadow-premium">
              {/* Top accent bar */}
              <div className="h-1" style={{ background:'linear-gradient(90deg,#e8184a 0%,#a80933 60%,#6366f1 100%)' }} />

              <motion.form variants={stagger} initial="hidden" animate="show"
                onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

                {/* Name */}
                <motion.div variants={rise} className="space-y-1.5 group">
                  <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                    Applicant Name
                  </label>
                  <div className="relative focus-within:scale-[1.01] transition-transform duration-300">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-500 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                    <input name="applicant_name" type="text" value={form.applicant_name}
                      onChange={handleChange} placeholder="e.g. Rajesh Kumar"
                      className={`input-base pl-10 pr-4 py-3 ${errors.applicant_name ? 'error' : ''}`} />
                  </div>
                  <FieldError msg={errors.applicant_name} />
                </motion.div>

                {/* Mobile + Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div variants={rise} className="space-y-1.5 group">
                    <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                      Mobile Number
                    </label>
                    <div className="relative focus-within:scale-[1.01] transition-transform duration-300">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-500 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                      <input name="mobile_number" type="tel" value={form.mobile_number}
                        onChange={handleChange} placeholder="9876543210" maxLength={10}
                        className={`input-base pl-10 pr-4 py-3 font-mono ${errors.mobile_number ? 'error' : ''}`} />
                    </div>
                    <FieldError msg={errors.mobile_number} />
                  </motion.div>

                  <motion.div variants={rise} className="space-y-1.5 group">
                    <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                      Preferred Language
                    </label>
                    <div className="relative focus-within:scale-[1.01] transition-transform duration-300">
                      <Languages size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-500 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                      <select name="preferred_language" value={form.preferred_language}
                        onChange={handleChange}
                        className={`input-base pl-10 pr-8 py-3 appearance-none ${errors.preferred_language ? 'error' : ''}`}>
                        <option value="" disabled>Select language</option>
                        {LANGUAGES.map(l => (
                          <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                        </svg>
                      </div>
                    </div>
                    <FieldError msg={errors.preferred_language} />
                  </motion.div>
                </div>

                {/* Amount */}
                <motion.div variants={rise} className="space-y-1.5 group">
                  <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                    Loan Amount (₹)
                  </label>
                  <div className="relative focus-within:scale-[1.01] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-500 font-bold text-sm pointer-events-none group-focus-within:text-brand-500 transition-colors">₹</span>
                    <input name="loan_amount" type="number" value={form.loan_amount}
                      onChange={handleChange} placeholder="50000" min="1"
                      className={`input-base pl-8 pr-4 py-3 font-display font-bold ${errors.loan_amount ? 'error' : ''}`} />
                  </div>
                  <FieldError msg={errors.loan_amount} />
                </motion.div>

                {/* Purpose */}
                <motion.div variants={rise} className="space-y-1.5 group">
                  <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                    Loan Purpose
                  </label>
                  <div className="relative focus-within:scale-[1.01] transition-transform duration-300">
                    <FileText size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-dark-500 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                    <textarea name="loan_purpose" rows={4} value={form.loan_purpose}
                      onChange={handleChange}
                      placeholder="e.g. Business expansion, medical emergency, educational fees…"
                      className={`input-base pl-10 pr-4 py-3 resize-none ${errors.loan_purpose ? 'error' : ''}`} />
                  </div>
                  <FieldError msg={errors.loan_purpose} />
                </motion.div>

                {/* Actions */}
                <motion.div variants={rise} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={() => navigate('/')}
                    className="btn-ghost flex-1 py-3 font-display justify-center">
                    Cancel
                  </motion.button>
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 10px 30px -10px rgba(232,24,74,0.5)" }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="btn-primary flex-1 py-3 justify-center gap-2">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                      : <><Zap size={15} className="fill-white" /> Submit Application</>
                    }
                  </motion.button>
                </motion.div>

              </motion.form>
            </div>
          </motion.div>
        )}

        {/* ── Success ───────────────────────────────────── */}
        {success && (
          <motion.div key="success"
            initial={{ opacity:0, scale:0.92, y:24 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.92, y:-24 }}
            transition={{ type:'spring', stiffness:280, damping:24 }}
            className="text-center">

            <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden
              border border-white/50 dark:border-white/[0.06] shadow-glass-dark max-w-lg mx-auto">
              {/* Top accent */}
              <div className="h-1.5" style={{ background:'linear-gradient(90deg,#10b981,#059669)' }} />

              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-500/6 blur-3xl rounded-full pointer-events-none" />

              {/* Checkmark */}
              <motion.div
                initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
                transition={{ type:'spring', stiffness:280, damping:18, delay:0.1 }}
                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-7
                  bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/25 dark:to-emerald-500/10
                  border-4 border-white dark:border-dark-800 shadow-xl relative z-10">
                <CheckCircle2 size={40} strokeWidth={2} className="text-emerald-600 dark:text-emerald-400" />
              </motion.div>

              <motion.h2 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                className="font-display font-extrabold text-3xl tracking-tight mb-2 relative z-10"
                style={{ background:'linear-gradient(135deg,#059669,#10b981)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Application Submitted!
              </motion.h2>
              <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                className="text-slate-500 dark:text-dark-400 text-sm mb-8 max-w-sm mx-auto relative z-10">
                Your loan application is under review by our underwriting team. Typical processing time is under 24 hours.
              </motion.p>

              {/* Summary */}
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
                className="rounded-2xl p-5 mb-6 text-left space-y-3 relative z-10
                  bg-white/70 dark:bg-dark-950/60
                  border border-slate-200/50 dark:border-dark-800/60">
                {[
                  ['Applicant', success.applicant_name],
                  ['Loan Amount', `₹${parseFloat(success.loan_amount).toLocaleString('en-IN')}`],
                  ['Language', success.preferred_language],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-sm border-b border-slate-100/60 dark:border-dark-800/40 last:border-0 pb-2.5 last:pb-0">
                    <span className="text-slate-500 dark:text-dark-400 font-medium">{k}</span>
                    <span className="font-display font-bold text-slate-800 dark:text-dark-100">{v}</span>
                  </div>
                ))}
              </motion.div>

              {/* Reference ID */}
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
                className="mb-8 relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-dark-600 mb-2">Reference ID</p>
                <div className="flex items-center gap-3 p-3.5 rounded-xl
                  bg-slate-100/60 dark:bg-dark-950/60
                  border border-slate-200/60 dark:border-dark-800/60 group">
                  <code className="flex-1 text-[11px] font-mono font-bold break-all text-left
                    text-slate-700 dark:text-brand-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors select-all">
                    {success.id}
                  </code>
                  <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                    onClick={copyId}
                    className="p-2 rounded-lg bg-white dark:bg-dark-800
                      border border-slate-200/60 dark:border-dark-700
                      hover:border-brand-500/50 text-slate-400 hover:text-brand-500 transition-all shadow-sm shrink-0">
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
                className="flex flex-col sm:flex-row gap-3 relative z-10">
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  onClick={() => setSuccess(null)}
                  className="btn-ghost flex-1 py-3.5 font-display justify-center">
                  New Application
                </motion.button>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  onClick={() => navigate('/')}
                  className="btn-primary flex-1 py-3.5 justify-center gap-2">
                  <ArrowLeft size={15} /> Back to Dashboard
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
