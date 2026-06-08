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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
    // Clear validation error when editing
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
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-brand-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Quick Loan Application</span>
              </div>
              <h2 className="text-3xl font-extrabold font-sans tracking-tight bg-gradient-to-r from-slate-900 via-brand-950 to-brand-600 dark:from-white dark:via-dark-100 dark:to-brand-400 bg-clip-text text-transparent">
                Apply for a Loan
              </h2>
              <p className="text-slate-500 dark:text-dark-400 text-sm">
                Submit details below to initiate processing. Standard review takes less than 24 hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-white/[0.06] relative overflow-hidden shadow-premium">
              {/* Card top gradient indicator */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-indigo-600" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Applicant Name */}
                <div className="space-y-2">
                  <label htmlFor="applicant_name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">
                    Applicant Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="applicant_name"
                      name="applicant_name"
                      value={formData.applicant_name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Kumar"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.02] border text-sm transition-all duration-300 outline-none focus:ring-4 focus:ring-brand-500/10 ${
                        errors.applicant_name
                          ? 'border-red-500/50 focus:border-red-500/50 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-white/10 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.applicant_name && (
                    <p className="text-xs text-red-500 font-semibold pl-1">{errors.applicant_name}</p>
                  )}
                </div>

                {/* Mobile Number & Preferred Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label htmlFor="mobile_number" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="mobile_number"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.02] border text-sm transition-all duration-300 outline-none focus:ring-4 focus:ring-brand-500/10 ${
                          errors.mobile_number
                            ? 'border-red-500/50 focus:border-red-500/50 text-red-600 dark:text-red-400'
                            : 'border-slate-200 dark:border-white/10 focus:border-brand-500'
                        }`}
                      />
                    </div>
                    {errors.mobile_number && (
                      <p className="text-xs text-red-500 font-semibold pl-1">{errors.mobile_number}</p>
                    )}
                  </div>

                  {/* Preferred Language */}
                  <div className="space-y-2">
                    <label htmlFor="preferred_language" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                        <Languages className="w-4 h-4" />
                      </div>
                      <select
                        id="preferred_language"
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.02] border text-sm transition-all duration-300 outline-none focus:ring-4 focus:ring-brand-500/10 appearance-none ${
                          errors.preferred_language
                            ? 'border-red-500/50 focus:border-red-500/50 text-red-600 dark:text-red-400'
                            : 'border-slate-200 dark:border-white/10 focus:border-brand-500'
                        }`}
                      >
                        <option value="" disabled className="text-slate-400 dark:bg-dark-900">Select language</option>
                        <option value="English" className="dark:bg-dark-900">English</option>
                        <option value="Hindi" className="dark:bg-dark-900">Hindi (हिंदी)</option>
                        <option value="Tamil" className="dark:bg-dark-900">Tamil (தமிழ்)</option>
                        <option value="Telugu" className="dark:bg-dark-900">Telugu (తెలుగు)</option>
                        <option value="Marathi" className="dark:bg-dark-900">Marathi (मराठी)</option>
                      </select>
                      
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                    {errors.preferred_language && (
                      <p className="text-xs text-red-500 font-semibold pl-1">{errors.preferred_language}</p>
                    )}
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                  <label htmlFor="loan_amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">
                    Loan Amount (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500 dark:text-dark-400 font-extrabold text-sm">
                      ₹
                    </div>
                    <input
                      type="number"
                      id="loan_amount"
                      name="loan_amount"
                      value={formData.loan_amount}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className={`w-full pl-9 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.02] border text-sm transition-all duration-300 outline-none focus:ring-4 focus:ring-brand-500/10 ${
                        errors.loan_amount
                          ? 'border-red-500/50 focus:border-red-500/50 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-white/10 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.loan_amount && (
                    <p className="text-xs text-red-500 font-semibold pl-1">{errors.loan_amount}</p>
                  )}
                </div>

                {/* Loan Purpose */}
                <div className="space-y-2">
                  <label htmlFor="loan_purpose" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-500">
                    Loan Purpose / Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 dark:text-dark-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    <textarea
                      id="loan_purpose"
                      name="loan_purpose"
                      value={formData.loan_purpose}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your loan usage plan (e.g. business expansion, medical, educational)..."
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.02] border text-sm transition-all duration-300 outline-none focus:ring-4 focus:ring-brand-500/10 resize-none ${
                        errors.loan_purpose
                          ? 'border-red-500/50 focus:border-red-500/50 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-white/10 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.loan_purpose && (
                    <p className="text-xs text-red-500 font-semibold pl-1">{errors.loan_purpose}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-white/[0.04] text-sm font-bold transition-all duration-300 text-slate-700 dark:text-dark-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-premium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-center py-6"
          >
            {/* Success Card */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/50 dark:border-white/[0.06] shadow-premium-hover max-w-xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500" />
              
              {/* Checkmark Animation */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6 border-4 border-emerald-50/50 dark:border-emerald-500/10 shadow-glow">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-indigo-600 dark:from-emerald-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                Application Received!
              </h2>
              <p className="text-slate-500 dark:text-dark-400 text-sm max-w-md mx-auto mb-8">
                Your loan application has been submitted successfully and is currently under review by our credit underwriting team.
              </p>

              {/* Application Details Summary */}
              <div className="bg-slate-100/50 dark:bg-white/[0.01] border border-slate-200/30 dark:border-white/[0.05] rounded-2xl p-5 mb-8 text-left space-y-3">
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-200/40 dark:border-white/[0.06] pb-2">
                  <span className="text-slate-400 dark:text-dark-500 uppercase">Field</span>
                  <span className="text-slate-400 dark:text-dark-500 uppercase">Value</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-dark-400 font-medium">Applicant Name</span>
                  <span className="font-extrabold text-slate-800 dark:text-dark-100">{submittedApp.applicant_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-dark-400 font-medium">Loan Amount</span>
                  <span className="font-extrabold text-slate-800 dark:text-dark-100">₹{parseFloat(submittedApp.loan_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-dark-400 font-medium">Language Preferred</span>
                  <span className="font-extrabold text-slate-800 dark:text-dark-100">{submittedApp.preferred_language}</span>
                </div>
              </div>

              {/* Reference ID Block */}
              <div className="space-y-2.5 mb-10">
                <span className="block text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-widest">
                  Application Reference ID
                </span>
                <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-100 dark:bg-dark-950 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                  <code className="text-xs font-mono font-bold select-all break-all text-slate-800 dark:text-brand-300">
                    {submittedApp.id}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-500 dark:text-dark-300 transition-all duration-300 shadow-sm"
                    title="Copy Application ID"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Finish Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSubmittedApp(null)}
                  className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-white/[0.04] text-sm font-bold transition-all duration-300 text-slate-600 dark:text-dark-300"
                >
                  Apply for New Loan
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-premium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
