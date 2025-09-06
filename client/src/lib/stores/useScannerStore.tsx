import { create } from "zustand";

interface ScannerState {
  isScanning: boolean;
  scanResult: string | null;
  error: string | null;
  
  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  setScanResult: (result: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  isScanning: false,
  scanResult: null,
  error: null,
  
  startScanning: () => set({ isScanning: true, error: null }),
  stopScanning: () => set({ isScanning: false }),
  setScanResult: (result) => set({ scanResult: result, isScanning: false }),
  setError: (error) => set({ error, isScanning: false }),
  reset: () => set({ isScanning: false, scanResult: null, error: null }),
}));