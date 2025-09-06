import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useScannerStore } from "@/lib/stores/useScannerStore";
import { AztecDecoder } from "@/lib/aztec-decoder";
import { useToast } from "@/hooks/use-toast";

export default function ImageUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { 
    isUploading, 
    uploadProgress, 
    setUploading, 
    setUploadProgress, 
    addScanResult, 
    setError 
  } = useScannerStore();
  const { toast } = useToast();
  
  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      
      const result = await AztecDecoder.decodeFromFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        addScanResult(result);
        setUploading(false);
        setUploadProgress(0);
        toast({
          title: "AZTEC Code Detected",
          description: "Successfully parsed data from uploaded image",
        });
      }, 500);
      
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : 'Failed to process image',
        variant: "destructive",
      });
    }
  }, [addScanResult, setError, setUploading, setUploadProgress, toast]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);
  
  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        processFile(target.files[0]);
      }
    };
    input.click();
  }, [processFile]);
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <i className="fas fa-upload mr-3 text-primary"></i>
          Upload Image
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Upload an image containing AZTEC code</p>
      </div>
      
      <CardContent className="p-6">
        <div 
          className={`upload-zone border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragOver ? 'dragover' : ''
          } ${isUploading ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:border-primary'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!isUploading ? handleFileSelect : undefined}
          data-testid="upload-zone"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-cloud-upload-alt text-2xl text-primary"></i>
            </div>
            <div>
              <p className="text-foreground font-medium">Drop your image here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
            </div>
            <div className="flex justify-center">
              <Button 
                disabled={isUploading}
                data-testid="button-browse-files"
              >
                <i className="fas fa-folder-open mr-2"></i>
                Browse Files
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WEBP (Max 10MB)</p>
          </div>
        </div>
        
        {isUploading && (
          <div className="mt-4 fade-in">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Processing image...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
