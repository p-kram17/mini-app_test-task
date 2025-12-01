"use client";

import { create } from "zustand";
import { toast } from "react-toastify";

type Role = "Admin" | "Individual" | null;

type State = {
  email?: string;
  role?: Role;
  setAuth: (email: string, role: Role) => void;
  clearAuth: () => void;
  // kept for compatibility: addToast will use react-toastify
  addToast: (message: string) => void;
};

const useClientStore = create<State>((set: any) => ({
  email: undefined,
  role: null,
  setAuth(email: string, role: Role) {
    set(() => ({ email, role }));
  },
  clearAuth() {
    set(() => ({ email: undefined, role: null }));
  },
  addToast(message: string) {
    // Delegate to react-toastify for consistent UI and accessibility
    try {
      toast(String(message));
    } catch (err) {
      // Fallback to console if toast isn't available
      // eslint-disable-next-line no-console
      console.log("toast:", message);
    }
  },
}));

export default useClientStore;
