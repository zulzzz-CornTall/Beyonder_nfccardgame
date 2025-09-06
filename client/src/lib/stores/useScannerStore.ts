import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface ScanResult {
  id: string;
  content: string;
  format: string;
  size: string;
  timestamp: string;
  metadata?: {
    layers?: number;
    dataBlocks?: number;
    errorCorrection?: string;
  };
}

export interface ScannerState {
  // Scanner state
  isScanning: boolean;
  isProcessing: boolean;
  scanResults: ScanResult[];
  currentResult: ScanResult | null;
  error: string | null;
  
  // Camera state
  isCameraActive: boolean;
  stream: MediaStream | null;
  
  // Upload state
  uploadProgress: number;
  isUploading: boolean;
  
  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  setProcessing: (processing: boolean) => void;
  addScanResult: (result: ScanResult) => void;
  setCurrentResult: (result: ScanResult | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setCameraActive: (active: boolean) => void;
  setStream: (stream: MediaStream | null) => void;
  setUploadProgress: (progress: number) => void;
  setUploading: (uploading: boolean) => void;
  clearResults: () => void;
}

export const useScannerStore = create<ScannerState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isScanning: false,
    isProcessing: false,
    scanResults: [],
    currentResult: null,
    error: null,
    isCameraActive: false,
    stream: null,
    uploadProgress: 0,
    isUploading: false,
    
    // Actions
    startScanning: () => {
      set({ isScanning: true, error: null });
    },
    
    stopScanning: () => {
      const { stream } = get();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      set({ 
        isScanning: false, 
        isCameraActive: false, 
        stream: null 
      });
    },
    
    setProcessing: (processing: boolean) => {
      set({ isProcessing: processing });
    },
    
    addScanResult: (result: ScanResult) => {
      set(state => ({
        scanResults: [result, ...state.scanResults.slice(0, 9)], // Keep last 10 results
        currentResult: result,
        error: null
      }));
    },
    
    setCurrentResult: (result: ScanResult | null) => {
      set({ currentResult: result });
    },
    
    setError: (error: string | null) => {
      set({ error, currentResult: null });
    },
    
    clearError: () => {
      set({ error: null });
    },
    
    setCameraActive: (active: boolean) => {
      set({ isCameraActive: active });
    },
    
    setStream: (stream: MediaStream | null) => {
      set({ stream });
    },
    
    setUploadProgress: (progress: number) => {
      set({ uploadProgress: progress });
    },
    
    setUploading: (uploading: boolean) => {
      set({ isUploading: uploading });
    },
    
    clearResults: () => {
      set({ scanResults: [], currentResult: null, error: null });
    }
  }))
);
