import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  User, 
  Phone, 
  Coins, 
  Languages, 
  FileText, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Staggered variants for form fields
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function ApplyLoan() {
  const { createApplication, loading } = useStore();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    mobile_number: '',
    loan_amount: '',
    loan_purpose: '',
    preferred_language: '',
  });

  // Validation Errors
  const [errors, setErrors] = useState({});
  
  // Successful Application Response
  const [submittedApp, setSubmittedApp] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Validate form fields client-side
  const validateForm = () => {
    const newErrors = {};

    if (!formData.applicant_name.trim()) {
      newErrors.applicant_name = 'Applicant name is required';
    } else if (formData.applicant_name.trim().length < 2) {
      newErrors.applicant_name = 'Name must be at least 2 characters';
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile_number.trim())) {
      newErrors.mobile_number = 'Mobile number must be a 10-digit number starting with 6-9';
    }

    const amountNum = parseFloat(formData.loan_amount);
    if (!formData.loan_amount) {
      newErrors.loan_amount = 'Loan amount is required';
    } else if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.loan_amount = 'Loan amount must be a number greater than 0';
    } else if (amountNum > 100000000) {
      newErrors.loan_amount = 'Loan amount must not exceed ₹100,000,000 (10 Cr)';
    }

    if (!formData.loan_purpose.trim()) {
      newErrors.loan_purpose = 'Loan purpose is required';
    } else if (formData.loan_purpose.trim().length < 5) {
      newErrors.loan_purpose = 'Purpose must describe the intent in at least 5 characters';
    }

    if (!formData.preferred_language) {
      newErrors.preferred_language = 'Preferred language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the validation errors before submitting.');
      return;
    }

    try {
      const result = await createApplication({
        ...formData,
        loan_amount: parseFloat(formData.loan_amount),
      });
      if (result) {
        setSubmittedApp(result);
        setFormData({
          applicant_name: '',
          mobile_number: '',
          loan_amount: '',
          loan_purpose: '',
          preferred_language: '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    if (!submittedApp) return;
    navigator.clipboard.writeText(submittedApp.id);
    setIsCopied(true);
    toast.success('Application ID copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      <AnimatePresence mode="wait">
        {!submittedApp ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-brand-500 font-semibold text-sm uppercase tracking-wider mb-1">
                <Sparkles className="w-4.5 h-4.5 animate-pulse text-glow" />
                <span className="text-glow">Quick Loan Application</span>
              </div>
              <h2 className="text-4xl font-extrabold font-sans tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-600 dark:from-white dark:via-dark-100 dark:to-brand-400 bg-clip-text text-transparent">
                Apply for a Loan
              </h2>
              <p className="text-slate-500 dark:text-dark-400 text-sm mt-1">
                Submit details below to initiate processing. Standard review takes less than 24 hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-white/[0.05] relative overflow-hidden shadow-premium">
              {/* Card top gradient indicator */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-indigo-600" />
              
              <motion.form 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                onSubmit={handleSubmit} 
                className="space-y-6 pt-2"
              >
                
                {/* Applicant Name */}
                <motion.div variants={itemVariants} className="space-y-2 relative group">
                  <label htmlFor="applicant_name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                    Applicant Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-dark-500 group-focus-within:text-brand-500 transition-colors">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="text"
                      id="applicant_name"
                      name="applicant_name"
                      value={formData.applicant_name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Kumar"
                      className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-dark-900/40 backdrop-blur-sm border text-sm font-medium transition-all outline-none focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 shadow-sm ${
                        errors.applicant_name
                          ? 'border-red-500/50 focus:border-red-500 text-red-600 dark:text-red-400'
                          : 'border-slate-200/60 dark:border-dark-800/60 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.applicant_name && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-bold pl-1">{errors.applicant_name}</motion.p>
                  )}
                </motion.div>

                {/* Mobile Number & Preferred Language (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Mobile Number */}
                  <motion.div variants={itemVariants} className="space-y-2 relative group">
                    <label htmlFor="mobile_number" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-dark-500 group-focus-within:text-brand-500 transition-colors">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type="tel"
                        id="mobile_number"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-dark-900/40 backdrop-blur-sm border text-sm font-mono font-bold transition-all outline-none focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 shadow-sm ${
                          errors.mobile_number
                            ? 'border-red-500/50 focus:border-red-500 text-red-600 dark:text-red-400'
                            : 'border-slate-200/60 dark:border-dark-800/60 focus:border-brand-500'
                        }`}
                      />
                    </div>
                    {errors.mobile_number && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-bold pl-1">{errors.mobile_number}</motion.p>
                    )}
                  </motion.div>

                  {/* Preferred Language */}
                  <motion.div variants={itemVariants} className="space-y-2 relative group">
                    <label htmlFor="preferred_language" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-dark-500 group-focus-within:text-brand-500 transition-colors">
                        <Languages className="w-4.5 h-4.5" />
                      </div>
                      <select
                        id="preferred_language"
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-dark-900/40 backdrop-blur-sm border text-sm font-semibold transition-all outline-none focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 appearance-none shadow-sm ${
                          errors.preferred_language
                            ? 'border-red-500/50 focus:border-red-500 text-red-600 dark:text-red-400'
                            : 'border-slate-200/60 dark:border-dark-800/60 focus:border-brand-500'
                        }`}
                      >
                        <option value="" disabled className="text-slate-400">Select language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                      </select>
                      
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                    {errors.preferred_language && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-bold pl-1">{errors.preferred_language}</motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Loan Amount */}
                <motion.div variants={itemVariants} className="space-y-2 relative group">
                  <label htmlFor="loan_amount" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                    Loan Amount (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-dark-500 font-extrabold text-base group-focus-within:text-brand-500 transition-colors">
                      ₹
                    </div>
                    <input
                      type="number"
                      id="loan_amount"
                      name="loan_amount"
                      value={formData.loan_amount}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className={`w-full pl-9 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-dark-900/40 backdrop-blur-sm border text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 shadow-sm ${
                        errors.loan_amount
                          ? 'border-red-500/50 focus:border-red-500 text-red-600 dark:text-red-400'
                          : 'border-slate-200/60 dark:border-dark-800/60 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.loan_amount && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-bold pl-1">{errors.loan_amount}</motion.p>
                  )}
                </motion.div>

                {/* Loan Purpose */}
                <motion.div variants={itemVariants} className="space-y-2 relative group">
                  <label htmlFor="loan_purpose" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400 group-focus-within:text-brand-500 transition-colors">
                    Loan Purpose / Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-3.5 pointer-events-none text-slate-400 dark:text-dark-500 group-focus-within:text-brand-500 transition-colors">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <textarea
                      id="loan_purpose"
                      name="loan_purpose"
                      value={formData.loan_purpose}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Please describe why you need this loan (e.g. Business expansion, medical emergency, educational fees)..."
                      className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-dark-900/40 backdrop-blur-sm border text-sm font-medium transition-all outline-none focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 resize-none shadow-sm ${
                        errors.loan_purpose
                          ? 'border-red-500/50 focus:border-red-500 text-red-600 dark:text-red-400'
                          : 'border-slate-200/60 dark:border-dark-800/60 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.loan_purpose && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-bold pl-1">{errors.loan_purpose}</motion.p>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:bg-slate-50 dark:hover:bg-dark-700 text-sm font-bold transition-colors text-slate-700 dark:text-dark-300 shadow-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3.5 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-brand flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </motion.button>
                </motion.div>

              </motion.form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-center py-10"
          >
            {/* Success Card */}
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/50 dark:border-white/[0.05] shadow-premium max-w-xl mx-auto relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
              
              <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

              {/* Checkmark Animation */}
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/30 dark:to-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-8 border-4 border-white dark:border-dark-800 shadow-xl"
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-indigo-600 dark:from-emerald-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3"
              >
                Application Received!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-slate-500 dark:text-dark-400 text-sm font-medium max-w-md mx-auto mb-8"
              >
                Your loan application has been submitted successfully and is currently under review by our credit underwriting team.
              </motion.p>

              {/* Application Details Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 mb-8 text-left space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-400 dark:text-dark-500 uppercase border-b border-slate-200/50 dark:border-dark-800/50 pb-3">
                  <span>Field</span>
                  <span>Value</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-dark-400 font-medium">Applicant Name</span>
                  <span className="font-bold text-slate-800 dark:text-dark-100">{submittedApp.applicant_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-dark-400 font-medium">Loan Amount</span>
                  <span className="font-bold text-slate-800 dark:text-dark-100">₹{parseFloat(submittedApp.loan_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-dark-400 font-medium">Language Preferred</span>
                  <span className="font-bold text-slate-800 dark:text-dark-100">{submittedApp.preferred_language}</span>
                </div>
              </motion.div>

              {/* Reference ID Block */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-2 mb-10">
                <span className="block text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest">
                  Application Reference ID
                </span>
                <div className="flex items-center justify-between gap-3 p-4 bg-slate-100/50 dark:bg-dark-950/50 rounded-xl border border-slate-200/50 dark:border-dark-800/50 group">
                  <code className="text-xs font-mono font-bold select-all break-all text-slate-800 dark:text-brand-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {submittedApp.id}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 hover:border-brand-500 dark:hover:border-brand-500 text-slate-500 dark:text-dark-400 transition-all shadow-sm"
                    title="Copy Application ID"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Finish Actions */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSubmittedApp(null)}
                  className="flex-1 px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:bg-slate-50 dark:hover:bg-dark-700 text-sm font-bold transition-colors text-slate-600 dark:text-dark-300 shadow-sm"
                >
                  Apply for New Loan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="flex-1 px-5 py-4 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-brand flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  Back to Dashboard
                </motion.button>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
