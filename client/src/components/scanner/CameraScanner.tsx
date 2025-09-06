import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCamera } from "@/hooks/use-camera";
import { useScannerStore } from "@/lib/stores/useScannerStore";

export default function CameraScanner() {
  const { videoRef, hasPermission, isCameraActive, startCamera, stopCamera, switchCamera } = useCamera();
  const { isScanning, startScanning, stopScanning } = useScannerStore();
  
  const handleStartCamera = async () => {
    await startCamera();
    if (isCameraActive) {
      startScanning();
    }
  };
  
  const handleStopCamera = () => {
    stopScanning();
    stopCamera();
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <i className="fas fa-camera mr-3 text-primary"></i>
          Camera Scanner
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Scan AZTEC codes in real-time</p>
      </div>
      
      <CardContent className="p-6">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
          {isCameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                data-testid="camera-video"
              />
              {isScanning && (
                <div className="scan-frame absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-video text-4xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground mb-4">Camera not active</p>
                <Button 
                  onClick={handleStartCamera}
                  data-testid="button-start-camera"
                  disabled={hasPermission === false}
                >
                  <i className="fas fa-play mr-2"></i>
                  Start Camera
                </Button>
                {hasPermission === false && (
                  <p className="text-sm text-destructive mt-2">
                    Camera permission required
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {isCameraActive && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <Button 
                variant="destructive" 
                onClick={handleStopCamera}
                data-testid="button-stop-camera"
              >
                <i className="fas fa-stop mr-2"></i>
                Stop
              </Button>
              <Button 
                variant="secondary" 
                onClick={switchCamera}
                data-testid="button-switch-camera"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Switch
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <i className={`fas fa-circle ${isScanning ? 'text-green-500 animate-pulse' : 'text-gray-400'}`}></i>
              <span>{isScanning ? 'Scanning...' : 'Ready'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
