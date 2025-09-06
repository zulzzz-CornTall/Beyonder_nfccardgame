import React, { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCamera } from "@/hooks/use-camera";
import { useScannerStore } from "@/lib/stores/useScannerStore";

interface CameraScannerProps {
  onScan?: (result: string) => void;
  onError?: (error: string) => void;
}

export function CameraScanner({ onScan, onError }: CameraScannerProps) {
  const { videoRef, isActive, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const { isScanning, scanResult, setScanResult, setError } = useScannerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartScan = useCallback(async () => {
    try {
      await startCamera();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start camera";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [startCamera, setError, onError]);

  const handleStopScan = useCallback(() => {
    stopCamera();
  }, [stopCamera]);

  const handleCapture = useCallback(() => {
    const photoData = capturePhoto();
    if (photoData) {
      // In a real implementation, you would process the photo for QR/NFC data
      // For now, we'll just simulate a successful scan
      const mockResult = "Mock scan result from camera";
      setScanResult(mockResult);
      onScan?.(mockResult);
    }
  }, [capturePhoto, setScanResult, onScan]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        // In a real implementation, you would process the image for QR/NFC data
        const mockResult = `Mock scan result from file: ${file.name}`;
        setScanResult(mockResult);
        onScan?.(mockResult);
      };
      reader.readAsDataURL(file);
    }
  }, [setScanResult, onScan]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Camera Scanner</h3>
            <p className="text-sm text-gray-600">
              Use your camera to scan QR codes or upload an image
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {scanResult && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">Scan result: {scanResult}</p>
            </div>
          )}

          <div className="relative">
            {isActive && (
              <video
                ref={videoRef}
                className="w-full h-48 bg-black rounded-md"
                autoPlay
                playsInline
                muted
              />
            )}
            {!isActive && (
              <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Camera not active</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isActive ? (
              <Button onClick={handleStartScan} className="flex-1">
                Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={handleCapture} className="flex-1">
                  Capture
                </Button>
                <Button onClick={handleStopScan} variant="outline" className="flex-1">
                  Stop
                </Button>
              </>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Or upload an image:</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              Upload Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CameraScanner;