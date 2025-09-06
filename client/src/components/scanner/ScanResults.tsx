import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScannerStore } from "@/lib/stores/useScannerStore";
import { useToast } from "@/hooks/use-toast";

export default function ScanResults() {
  const { currentResult, error, setError } = useScannerStore();
  const { toast } = useToast();
  
  const copyContent = async () => {
    if (!currentResult) return;
    
    try {
      await navigator.clipboard.writeText(currentResult.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const exportData = () => {
    if (!currentResult) return;
    
    const data = {
      content: currentResult.content,
      format: currentResult.format,
      size: currentResult.size,
      timestamp: currentResult.timestamp,
      metadata: currentResult.metadata
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aztec-scan-${currentResult.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported",
      description: "Scan data exported successfully",
    });
  };
  
  const retryParsing = () => {
    setError(null);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <i className="fas fa-search mr-3 text-primary"></i>
          Scan Results
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Decoded AZTEC data will appear here</p>
      </div>
      
      <CardContent className="p-6">
        {/* Empty State */}
        {!currentResult && !error && (
          <div className="text-center py-8" data-testid="empty-state">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-barcode text-2xl text-muted-foreground"></i>
            </div>
            <p className="text-muted-foreground">No AZTEC code detected yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start scanning or upload an image</p>
          </div>
        )}
        
        {/* Success Result */}
        {currentResult && !error && (
          <div className="fade-in" data-testid="success-result">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-3"></i>
                <div>
                  <p className="text-green-800 dark:text-green-200 font-medium">AZTEC Code Detected</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">Successfully parsed data</p>
                </div>
              </div>
            </div>
            
            {/* Decoded Data */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Decoded Content</label>
                <div className="bg-muted rounded-lg p-4">
                  <code className="text-sm text-foreground break-all" data-testid="text-decoded-content">
                    {currentResult.content}
                  </code>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Format</label>
                  <p className="text-sm bg-muted rounded-lg p-3" data-testid="text-code-format">
                    {currentResult.format}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Size</label>
                  <p className="text-sm bg-muted rounded-lg p-3" data-testid="text-code-size">
                    {currentResult.size}
                  </p>
                </div>
              </div>
              
              {currentResult.metadata && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Metadata</label>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-xs text-muted-foreground overflow-x-auto" data-testid="text-metadata">
                      {JSON.stringify(currentResult.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={copyContent} 
                className="flex-1"
                data-testid="button-copy-content"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Content
              </Button>
              <Button 
                variant="secondary" 
                onClick={exportData} 
                className="flex-1"
                data-testid="button-export-data"
              >
                <i className="fas fa-download mr-2"></i>
                Export Data
              </Button>
            </div>
          </div>
        )}
        
        {/* Error Result */}
        {error && (
          <div className="fade-in" data-testid="error-result">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-red-500 mr-3 mt-0.5"></i>
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">Parsing Failed</p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1" data-testid="text-error-message">
                    {error}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Troubleshooting Tips */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Troubleshooting Tips:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <i className="fas fa-chevron-right text-xs mt-1 mr-2"></i>
                  Ensure the image is clear and well-lit
                </li>
                <li className="flex items-start">
                  <i className="fas fa-chevron-right text-xs mt-1 mr-2"></i>
                  Try uploading a higher resolution image
                </li>
                <li className="flex items-start">
                  <i className="fas fa-chevron-right text-xs mt-1 mr-2"></i>
                  Check if the code is fully visible in the frame
                </li>
                <li className="flex items-start">
                  <i className="fas fa-chevron-right text-xs mt-1 mr-2"></i>
                  Verify the barcode format is AZTEC
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={retryParsing} 
              className="w-full mt-4"
              data-testid="button-retry-parsing"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
