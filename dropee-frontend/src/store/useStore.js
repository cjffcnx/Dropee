import { create } from 'zustand';

const useStore = create((set) => ({
  // Files state
  files: [],
  setFiles: (files) => set({ files }),

  // Upload progress
  progress: 0,
  setProgress: (progress) => set({ progress }),

  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),

  // User ID
  userId: null,
  setUserId: (userId) => set({ userId }),

  // Toast notifications
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: Date.now(), ...toast },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Upload result
  uploadResult: null,
  setUploadResult: (result) => set({ uploadResult: result }),
}));

export default useStore;
