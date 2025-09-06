import { useState, useEffect, useRef } from "react";
import { useScannerStore } from "@/lib/stores/useScannerStore";
import { AztecDecoder } from "@/lib/aztec-decoder";

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();
  
  const {
    isCameraActive,
    stream,
    isScanning,
    setStream,
    setCameraActive,
    addScanResult,
    setError,
    stopScanning
  } = useScannerStore();
  
  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setHasPermission(result.state === 'granted');
        
        result.onchange = () => {
          setHasPermission(result.state === 'granted');
        };
      } catch {
        // Fallback if permissions API is not supported
        setHasPermission(null);
      }
    };
    
    checkPermissions();
  }, []);
  
  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      setError('Camera access denied or not available. Please check your permissions.');
      setHasPermission(false);
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    stopScanning();
    setStream(null);
    setCameraActive(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  // Switch camera (front/back)
  const switchCamera = async () => {
    if (!isCameraActive) return;
    
    const currentTrack = stream?.getVideoTracks()[0];
    const currentFacingMode = currentTrack?.getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    
    try {
      stopCamera();
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: newFacingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Failed to switch camera:', error);
      setError('Failed to switch camera. Using default camera.');
      // Fallback to original camera
      startCamera();
    }
  };
  
  // Scan for AZTEC codes in video
  const scanVideo = async () => {
    if (!videoRef.current || !isScanning) return;
    
    try {
      const result = await AztecDecoder.decodeFromVideo(videoRef.current);
      if (result) {
        addScanResult(result);
        // Optionally stop scanning after finding a code
        // stopScanning();
      }
    } catch (error) {
      console.error('Error scanning video frame:', error);
    }
    
    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanVideo);
    }
  };
  
  // Start/stop scanning
  useEffect(() => {
    if (isScanning && isCameraActive) {
      scanVideo();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScanning, isCameraActive]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return {
    videoRef,
    hasPermission,
    isCameraActive,
    startCamera,
    stopCamera,
    switchCamera
  };
};
