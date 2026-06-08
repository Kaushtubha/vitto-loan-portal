import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

// Dynamic self-sensing API URL resolver
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  return 'https://vitto-loan-portal-dkoh.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const useStore = create((set, get) => ({
  // Theme State
  theme: 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  // Applications State
  applications: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  },
  summary: {
    totalApplications: 0,
    totalAmount: 0,
    approvedAmount: 0,
    statusCounts: {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    languageDistribution: [],
    recentApplications: [],
  },
  loading: false,
  error: null,

  // Fetch Applications with Filters
  fetchApplications: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const { status, search, page = 1, limit = 10 } = filters;
      const params = {};
      if (status && status !== 'all') params.status = status;
      if (search) params.search = search;
      params.page = page;
      params.limit = limit;

      const response = await api.get('/applications', { params });
      if (response.data.success) {
        set({
          applications: response.data.data,
          pagination: response.data.pagination,
          loading: false,
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || 'Failed to load applications';
      set({ error: errMsg, loading: false });
      toast.error(errMsg);
    }
  },

  // Fetch Summary statistics
  fetchSummary: async () => {
    try {
      const response = await api.get('/summary');
      if (response.data.success) {
        set({ summary: response.data.data });
      }
    } catch (err) {
      console.error('Failed to load summary stats:', err);
    }
  },

  // Submit new loan application
  createApplication: async (formData) => {
    set({ loading: true });
    try {
      const response = await api.post('/applications', formData);
      if (response.data.success) {
        toast.success('Loan application submitted successfully!');
        set({ loading: false });
        // Refresh dashboard summary
        get().fetchSummary();
        return response.data.data;
      }
    } catch (err) {
      set({ loading: false });
      const errMsg = err.response?.data?.error?.message || 'Failed to submit application';
      const validationDetails = err.response?.data?.error?.details;
      
      if (validationDetails) {
        // If there are detailed fields validations, show them
        Object.values(validationDetails).forEach(msg => toast.error(msg));
      } else {
        toast.error(errMsg);
      }
      throw err;
    }
  },

  // Update application status (Optimistic UI updates)
  updateStatus: async (id, newStatus) => {
    const previousApplications = [...get().applications];
    const previousSummary = { ...get().summary };
    const previousStatusCounts = { ...previousSummary.statusCounts };

    // Find target application
    const appToUpdateIndex = previousApplications.findIndex((app) => app.id === id);
    if (appToUpdateIndex === -1) return;

    const originalApp = previousApplications[appToUpdateIndex];
    const oldStatus = originalApp.status;

    if (oldStatus === newStatus) return; // No change

    // Optimistically update the list
    const updatedApplications = [...previousApplications];
    updatedApplications[appToUpdateIndex] = {
      ...originalApp,
      status: newStatus,
    };

    // Optimistically update the summary counts
    const updatedStatusCounts = { ...previousStatusCounts };
    updatedStatusCounts[oldStatus] = Math.max(0, updatedStatusCounts[oldStatus] - 1);
    updatedStatusCounts[newStatus] = (updatedStatusCounts[newStatus] || 0) + 1;

    // Optimistically calculate amount summary change
    let updatedApprovedAmount = previousSummary.approvedAmount;
    const loanAmountNum = parseFloat(originalApp.loan_amount);

    if (newStatus === 'approved') {
      updatedApprovedAmount += loanAmountNum;
    } else if (oldStatus === 'approved') {
      updatedApprovedAmount = Math.max(0, updatedApprovedAmount - loanAmountNum);
    }

    set({
      applications: updatedApplications,
      summary: {
        ...previousSummary,
        statusCounts: updatedStatusCounts,
        approvedAmount: updatedApprovedAmount,
      },
    });

    try {
      const response = await api.patch(`/applications/${id}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Application status updated to ${newStatus}`);
        // Background refresh to keep everything in sync
        get().fetchSummary();
      }
    } catch (err) {
      // Rollback on error
      set({
        applications: previousApplications,
        summary: previousSummary,
      });
      const errMsg = err.response?.data?.error?.message || 'Failed to update status';
      toast.error(`Rollback: ${errMsg}`);
    }
  },
}));
